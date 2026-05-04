<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\DocumentOcrInterface;
use App\Contracts\FileStorageInterface;
use App\Contracts\ImageProviderInterface;
use App\Contracts\PaymentGatewayInterface;
use App\Contracts\PushNotificationInterface;
use App\Contracts\WebPushInterface;
use App\Services\GoogleImageService;
use App\Services\WebPushService;
use App\Services\ClaudeOcrService;
use App\Services\DocumentService;
use App\Services\ExpoPushNotificationService;
use App\Services\TicketOrderService;
use App\Services\FileStorageService;
use App\Services\StripePaymentService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Stripe\StripeClient;

/**
 * Principle: DIP — all bindings and infrastructure wiring centralised here.
 * Principle: SRP — rate limiters are infrastructure concern, registered in boot only.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * Bindings for Contracts → Adapters go here.
     */
    public function register(): void
    {
        // DIP: bind the contract to the appropriate disk adapter.
        //
        // Production (FILESYSTEM_DISK=s3): uses S3 / R2 / any S3-compatible store.
        //   temporaryUrl() is natively signed by the SDK — no Laravel route needed.
        //   Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION,
        //   AWS_BUCKET (and optionally AWS_ENDPOINT for R2) in Render env vars.
        //
        // Local dev (FILESYSTEM_DISK=local): uses storage/app/private/ with
        //   serve:true so Laravel signs and serves the files directly.
        //   NOTE: do NOT run `php artisan route:cache` while using the local disk —
        //   the storage.local Closure route is skipped when routes are cached,
        //   causing temporaryUrl() to throw InvalidArgumentException → 500.
        $this->app->bind(FileStorageInterface::class, function () {
            $diskName = config('filesystems.default', 'local');
            return new FileStorageService(
                Storage::disk($diskName),
                config('filesystems.r2_public_url', ''),
            );
        });

        $this->app->bind(
            TicketOrderService::class,
            fn ($app) => new TicketOrderService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(
            \App\Services\AdminPlaceService::class,
            fn ($app) => new \App\Services\AdminPlaceService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(\App\Services\AdminPlaceImportService::class);

        $this->app->bind(\Google\Client::class, function (): \Google\Client {
            $client = new \Google\Client();
            $client->setClientId(config('services.google.client_id'));
            return $client;
        });

        $this->app->bind(
            \App\Services\DynamicSubmissionService::class,
            fn ($app) => new \App\Services\DynamicSubmissionService(
                $app->make(FileStorageInterface::class)
            )
        );

        // DIP: bind Google Custom Search adapter. Swap provider by rebinding here only.
        $this->app->bind(ImageProviderInterface::class, function () {
            return new GoogleImageService(
                config('services.google.cse_api_key', ''),
                config('services.google.cse_id', ''),
            );
        });

        // DIP: bind Claude vision adapter for document OCR.
        $this->app->bind(DocumentOcrInterface::class, ClaudeOcrService::class);

        $this->app->bind(\App\Services\DocumentUploadLimiterService::class);

        $this->app->bind(
            DocumentService::class,
            fn ($app) => new DocumentService(
                $app->make(DocumentOcrInterface::class),
                $app->make(FileStorageInterface::class),
                $app->make(\App\Services\DocumentUploadLimiterService::class),
            )
        );

        $this->app->bind(
            \App\Services\RestaurantService::class,
            fn ($app) => new \App\Services\RestaurantService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(
            \App\Services\MenuService::class,
            fn ($app) => new \App\Services\MenuService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(\App\Services\FoodOrderService::class);
        $this->app->bind(\App\Services\MerchantAuthService::class);
        $this->app->bind(\App\Services\MerchantOtpService::class);
        $this->app->bind(\App\Services\MerchantRegistrationService::class);

        $this->app->bind(
            \App\Services\KycService::class,
            fn ($app) => new \App\Services\KycService(
                $app->make(FileStorageInterface::class)
            )
        );

        // DIP: bind Expo push adapter. To switch to FCM direct, swap ExpoPushNotificationService.
        $this->app->bind(PushNotificationInterface::class, ExpoPushNotificationService::class);

        // DIP: bind VAPID browser push adapter. To switch provider, swap WebPushService here.
        $this->app->bind(WebPushInterface::class, WebPushService::class);

        // DIP: bind Stripe adapter to the payment gateway contract.
        // To switch provider: swap StripePaymentService for an OmisePaymentService here.
        $this->app->bind(PaymentGatewayInterface::class, function (): StripePaymentService {
            return new StripePaymentService(
                new StripeClient(config('services.stripe.secret')),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Enable _method spoofing so multipart/form-data POST requests with _method=PATCH
        // are treated as PATCH. PHP only populates $_FILES for POST, so file uploads must
        // always POST — method spoofing bridges the gap for REST PATCH routes.
        \Illuminate\Http\Request::enableHttpMethodParameterOverride();

        $this->configureRateLimiting();

        // Broadcast auth — must use auth:sanctum so mobile Bearer tokens are accepted.
        Broadcast::routes(['middleware' => ['auth:sanctum']]);
        require base_path('routes/channels.php');

        // All listeners (MarkSubmissionProcessing, MarkTicketOrderProcessing,
        // NotifyMerchantOfNewOrder, NotifyCustomerOfFoodOrderStatus, SendWebPushToAdmins*, etc.)
        // are registered automatically via Laravel's event auto-discovery — their handle() methods
        // are type-hinted with the event class.
        // Do NOT add Event::listen() here; doing so registers them twice → duplicate side-effects.
    }

    private function configureRateLimiting(): void
    {
        // 60 requests/minute per authenticated user or IP
        RateLimiter::for('api', function (Request $request): Limit {
            return Limit::perMinute(60)->by(
                $request->user()?->id ?? $request->ip()
            );
        });

        // 5 requests/minute per IP — used on auth endpoints
        RateLimiter::for('auth', function (Request $request): Limit {
            return Limit::perMinute(5)->by($request->ip());
        });

        // 120 requests/minute per authenticated admin — guards against runaway scripts
        // and bulk data-scraping while comfortably accommodating normal dashboard use.
        RateLimiter::for('admin', function (Request $request): Limit {
            return Limit::perMinute(120)->by(
                $request->user()?->id ?? $request->ip()
            );
        });
    }
}
