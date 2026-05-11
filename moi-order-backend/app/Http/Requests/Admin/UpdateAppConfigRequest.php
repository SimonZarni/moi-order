<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\AppAlertFrequency;
use App\Enums\AppUpdateType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validates the admin PATCH/PUT payload for app configuration.
 *
 * SRP: validation + authorisation only — never passed to the service layer.
 * Security: all string fields have max length guards; URL fields validated as URLs.
 * Validation: semver pattern enforced via regex; enums use Rule::enum().
 */
class UpdateAppConfigRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Auth is enforced by AdminAuthenticate middleware on the route group.
        // Super-admin is NOT required; any authenticated admin may update app config.
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'ios_min_version'     => ['nullable', 'string', 'max:20', 'regex:/^\d+\.\d+\.\d+$/'],
            'android_min_version' => ['nullable', 'string', 'max:20', 'regex:/^\d+\.\d+\.\d+$/'],
            'update_type'         => ['required', Rule::enum(AppUpdateType::class)],
            'update_title'        => ['nullable', 'string', 'max:255'],
            'update_message'      => ['nullable', 'string', 'max:1000'],
            'ios_store_url'       => ['nullable', 'string', 'url', 'max:500'],
            'android_store_url'   => ['nullable', 'string', 'url', 'max:500'],
            'alert_is_active'     => ['required', 'boolean'],
            'alert_title'         => ['nullable', 'string', 'max:255'],
            'alert_message'       => ['nullable', 'string', 'max:1000'],
            'alert_frequency'     => ['required', Rule::enum(AppAlertFrequency::class)],
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
            'alert_frequency.enum'      => 'Alert frequency must be one of: once_per_day, every_open.',
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
            'alert_is_active'     => 'alert active',
            'alert_title'         => 'alert title',
            'alert_message'       => 'alert message',
            'alert_frequency'     => 'alert frequency',
        ];
    }
}
