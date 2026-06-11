<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'body'  => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp,gif,heic,heif,bmp,tiff', 'max:51200'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            if (empty($this->input('body')) && ! $this->hasFile('image')) {
                $v->errors()->add('body', 'A message body or image is required.');
            }
        });
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'body.max'    => 'Message must not exceed 2000 characters.',
            'image.mimes' => 'Image must be jpeg, png, webp, gif, heic, heif, bmp, or tiff.',
            'image.max'   => 'Image must not exceed 50 MB.',
        ];
    }

    /** @return array<string, string> */
    public function attributes(): array
    {
        return [
            'body'  => 'message',
            'image' => 'image',
        ];
    }
}
