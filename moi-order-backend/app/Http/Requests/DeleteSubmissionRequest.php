<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use Illuminate\Foundation\Http\FormRequest;

class DeleteSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $submission = ServiceSubmission::where('user_id', $this->user()->id)
            ->find((int) $this->route('id'));

        return $submission !== null
            && $submission->status === SubmissionStatus::Cancelled;
    }

    public function rules(): array
    {
        return [];
    }
}
