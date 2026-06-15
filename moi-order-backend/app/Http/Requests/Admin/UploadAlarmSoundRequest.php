<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — validates alarm sound upload only.
 */
class UploadAlarmSoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route is guarded by ensure.super_admin middleware
    }

    public function rules(): array
    {
        return [
            'sound' => ['required', 'file', 'mimes:mp3,wav,ogg', 'max:2048'],
        ];
    }

    public function attributes(): array
    {
        return [
            'sound' => 'alarm sound',
        ];
    }

    public function messages(): array
    {
        return [
            'sound.mimes' => 'The alarm sound must be an MP3, WAV, or OGG file.',
            'sound.max'   => 'The alarm sound must not exceed 2 MB.',
        ];
    }
}
