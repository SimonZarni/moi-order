<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\FileStorageInterface;
use App\Services\FileStorageService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;

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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
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
