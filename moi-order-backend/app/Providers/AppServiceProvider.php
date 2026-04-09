<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
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
        //
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
