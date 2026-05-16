<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\AppUpdateType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates the admin PUT payload for app update-gating configuration only.
 * Alerts are managed separately via /in-app-alerts endpoints.
 */
class UpdateAppConfigRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'ios_min_version'     => ['nullable', 'string', 'max:20', 'regex:/^\d+\.\d+\.\d+$/'],
            'ios_min_build'       => ['nullable', 'integer', 'min:1'],
            'android_min_version' => ['nullable', 'string', 'max:20', 'regex:/^\d+\.\d+\.\d+$/'],
            'android_min_code'    => ['nullable', 'integer', 'min:1'],
            'update_type'         => ['required', Rule::enum(AppUpdateType::class)],
            'update_title'        => ['nullable', 'string', 'max:255'],
            'update_message'      => ['nullable', 'string', 'max:1000'],
            'ios_store_url'       => ['nullable', 'string', 'url', 'max:500'],
            'android_store_url'   => ['nullable', 'string', 'url', 'max:500'],
            'next_version'        => ['nullable', 'string', 'max:20', 'regex:/^\d+\.\d+\.\d+$/'],
            'changelog'           => ['nullable', 'array', 'max:20'],
            'changelog.*'         => ['string', 'max:200'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'ios_min_version.regex'     => 'iOS min version must be in semver format (e.g. 1.2.3).',
            'android_min_version.regex' => 'Android min version must be in semver format (e.g. 1.2.3).',
            'ios_store_url.url'         => 'iOS store URL must be a valid URL.',
            'android_store_url.url'     => 'Android store URL must be a valid URL.',
            'update_type.enum'          => 'Update type must be one of: none, optional, required.',
            'next_version.regex'        => 'Next version must be in semver format (e.g. 1.2.0).',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'ios_min_version'     => 'iOS minimum version',
            'android_min_version' => 'Android minimum version',
            'update_type'         => 'update type',
            'update_title'        => 'update title',
            'update_message'      => 'update message',
            'ios_store_url'       => 'iOS App Store URL',
            'android_store_url'   => 'Google Play URL',
            'next_version'        => 'next version',
            'changelog'           => 'changelog',
        ];
    }
}
