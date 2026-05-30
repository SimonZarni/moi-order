<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'stripe' => [
        'secret'          => env('STRIPE_SECRET_KEY'),
        'publishable_key' => env('STRIPE_PUBLISHABLE_KEY'),
        'webhook_secret'  => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'ios_client_id' => env('GOOGLE_IOS_CLIENT_ID'),
    ],

    'google_places' => [
        'api_key' => env('GOOGLE_PLACES_API_KEY', ''),
    ],

    'apple' => [
        'client_id' => env('APPLE_CLIENT_ID', 'com.moiorder.app'),
    ],

    'line' => [
        'channel_id' => env('LINE_CHANNEL_ID'),
    ],

    'thaibulksms' => [
        'key' => env('THAIBULKSMS_KEY'),
        'secret' => env('THAIBULKSMS_SECRET'),
        'sender' => env('THAIBULKSMS_SENDER'),
    ],

    'anthropic' => [
        'api_key' => env('ANTHROPIC_API_KEY'),
        'model'   => env('ANTHROPIC_MODEL', 'claude-haiku-4-5-20251001'),
    ],

    'firebase' => [
        'project_id'       => env('FIREBASE_PROJECT_ID'),
        'credentials_path' => env('FIREBASE_CREDENTIALS_PATH', storage_path('app/firebase-service-account.json')),
    ],

    'vapid' => [
        'public_key'  => env('VAPID_PUBLIC_KEY'),
        'private_key' => env('VAPID_PRIVATE_KEY'),
        'subject'     => env('VAPID_SUBJECT', 'mailto:admin@example.com'),
    ],

];
