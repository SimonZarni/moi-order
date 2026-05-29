<?php

declare(strict_types=1);

return [
    'default' => env('BROADCAST_CONNECTION', 'null'),

    'connections' => [

        /*
         * Laravel Reverb — self-hosted, free, Pusher-compatible.
         * Install: composer require laravel/reverb
         *          php artisan reverb:install
         * The install command auto-populates the REVERB_* keys in .env.
         * Start: php artisan reverb:start  (or Supervisor in production)
         */
        'reverb' => [
            'driver'  => 'reverb',
            'key'     => env('REVERB_APP_KEY'),
            'secret'  => env('REVERB_APP_SECRET'),
            'app_id'  => env('REVERB_APP_ID'),
            'options' => [
                'host'    => env('REVERB_HOST', '0.0.0.0'),
                'port'    => env('REVERB_PORT', 8080),
                'scheme'  => env('REVERB_SCHEME', 'http'),
                'useTLS'  => env('REVERB_SCHEME', 'http') === 'https',
            ],
        ],

        /*
         * Pusher cloud — pusher.com, free tier: 200k messages/day, 100 connections.
         * Create a Channels app → copy PUSHER_* vars from its Credentials tab.
         */
        'pusher' => [
            'driver'  => 'pusher',
            'key'     => env('PUSHER_APP_KEY'),
            'secret'  => env('PUSHER_APP_SECRET'),
            'app_id'  => env('PUSHER_APP_ID'),
            'options' => [
                'cluster'   => env('PUSHER_APP_CLUSTER', 'ap1'),
                'useTLS'    => true,
                'encrypted' => true,
            ],
        ],

        'log'  => ['driver' => 'log'],
        'null' => ['driver' => 'null'],
    ],
];
