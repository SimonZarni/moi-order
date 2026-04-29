<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ThaiBulkSmsOtpService
{
    private const REQUEST_URL = 'https://otp.thaibulksms.com/v2/otp/request';
    private const VERIFY_URL = 'https://otp.thaibulksms.com/v2/otp/verify';

    public function requestOtp(string $phoneNumber): string
    {
        $payload = [
            'key' => (string) config('services.thaibulksms.key'),
            'secret' => (string) config('services.thaibulksms.secret'),
            'msisdn' => $phoneNumber,
        ];

        $response = Http::asForm()->timeout(15)->acceptJson()->post(self::REQUEST_URL, $payload);

        Log::debug('ThaiBulkSMS OTP request', [
            'msisdn'      => $phoneNumber,
            'http_status' => $response->status(),
            'body'        => $response->body(),
            'json'        => $response->json(),
        ]);

        if (! $response->ok()) {
            Log::error('ThaiBulkSMS OTP request failed', [
                'msisdn'      => $phoneNumber,
                'http_status' => $response->status(),
                'body'        => $response->body(),
            ]);

            throw ValidationException::withMessages([
                'phone_number' => [$this->resolveErrorMessage($response->json())],
            ]);
        }

        $token = $response->json('data.token') ?? $response->json('token');

        Log::debug('ThaiBulkSMS OTP token extracted', [
            'token_present' => is_string($token) && $token !== '',
        ]);

        if (! is_string($token) || $token === '') {
            Log::error('ThaiBulkSMS OTP token missing in success response', [
                'json' => $response->json(),
            ]);

            throw ValidationException::withMessages([
                'phone_number' => ['OTP request failed. Please try again.'],
            ]);
        }

        return $token;
    }

    public function verifyOtp(string $token, string $pin): void
    {
        $payload = [
            'key' => (string) config('services.thaibulksms.key'),
            'secret' => (string) config('services.thaibulksms.secret'),
            'token' => $token,
            'pin' => $pin,
        ];

        $response = Http::asForm()->timeout(15)->acceptJson()->post(self::VERIFY_URL, $payload);

        Log::debug('ThaiBulkSMS OTP verify', [
            'http_status' => $response->status(),
            'body'        => $response->body(),
            'json'        => $response->json(),
        ]);

        if (! $response->ok()) {
            Log::error('ThaiBulkSMS OTP verify failed', [
                'http_status' => $response->status(),
                'body'        => $response->body(),
            ]);

            throw ValidationException::withMessages([
                'pin' => [$this->resolveErrorMessage($response->json())],
            ]);
        }

        $status = $response->json('data.status') ?? $response->json('status');
        if (is_string($status) && strtolower($status) !== 'success') {
            throw ValidationException::withMessages([
                'pin' => [$this->resolveErrorMessage($response->json())],
            ]);
        }
    }

    /**
     * @param mixed $payload
     */
    private function resolveErrorMessage(mixed $payload): string
    {
        if (is_array($payload)) {
            $message = $payload['message'] ?? $payload['error'] ?? null;
            if (is_string($message) && $message !== '') {
                return $message;
            }

            $detail = $payload['detail'] ?? $payload['errors'] ?? null;
            if (is_array($detail)) {
                $first = reset($detail);
                if (is_string($first) && $first !== '') {
                    return $first;
                }
            }

            $nestedMessage = $payload['data']['message'] ?? null;
            if (is_string($nestedMessage) && $nestedMessage !== '') {
                return $nestedMessage;
            }
        }

        return 'OTP request failed. Please try again.';
    }
}
