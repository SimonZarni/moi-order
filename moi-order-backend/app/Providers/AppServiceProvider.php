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
        // DIP: bind the contract to the local-disk adapter.
        // To switch to S3: swap FileStorageService for an S3FileStorageService here.
        $this->app->bind(FileStorageInterface::class, function () {
            // 'local' disk → storage/app/private/ (outside web root) with serve:true.
            // temporaryUrl() generates signed routes served by Laravel — no storage:link needed.
            // In production: swap to an S3FileStorageService that natively signs URLs.
            return new FileStorageService(Storage::disk('local'));
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
