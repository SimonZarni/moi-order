<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\FileStorageInterface;
use App\Contracts\PaymentGatewayInterface;
use App\Events\PaymentConfirmed;
use App\Listeners\MarkSubmissionProcessing;
use App\Services\FileStorageService;
use App\Services\StripePaymentService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
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
            return new FileStorageService(Storage::disk($diskName));
        });

        $this->app->bind(
            \App\Services\NinetyDayReportService::class,
            fn ($app) => new \App\Services\NinetyDayReportService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(
            \App\Services\CompanyRegistrationService::class,
            fn ($app) => new \App\Services\CompanyRegistrationService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(
            \App\Services\AirportFastTrackService::class,
            fn ($app) => new \App\Services\AirportFastTrackService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(
            \App\Services\EmbassyResidentialService::class,
            fn ($app) => new \App\Services\EmbassyResidentialService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(
            \App\Services\EmbassyCarLicenseService::class,
            fn ($app) => new \App\Services\EmbassyCarLicenseService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(
            \App\Services\EmbassyBankService::class,
            fn ($app) => new \App\Services\EmbassyBankService(
                $app->make(FileStorageInterface::class)
            )
        );

        $this->app->bind(
            \App\Services\TestService::class,
            fn ($app) => new \App\Services\TestService(
                $app->make(FileStorageInterface::class)
            )
        );

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
        $this->configureRateLimiting();

        Event::listen(PaymentConfirmed::class, MarkSubmissionProcessing::class);
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

        // 20 requests/minute per authenticated user or IP — admin endpoints
        RateLimiter::for('admin', function (Request $request): Limit {
            return Limit::perMinute(20)->by(
                $request->user()?->id ?? $request->ip()
            );
        });
    }
}
