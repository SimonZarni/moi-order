<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use Illuminate\Foundation\Http\FormRequest;

class CancelSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $submission = ServiceSubmission::where('user_id', $this->user()->id)
            ->where('uuid', $this->route('id'))
            ->first();

        return $submission !== null
            && $submission->status === SubmissionStatus::PendingPayment;
    }

    public function rules(): array
    {
        return [];
    }
}
