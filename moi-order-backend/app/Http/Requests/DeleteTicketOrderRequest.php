<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\TicketOrderStatus;
use App\Models\TicketOrder;
use Illuminate\Foundation\Http\FormRequest;

class DeleteTicketOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = TicketOrder::where('user_id', $this->user()->id)
            ->find((int) $this->route('id'));

        return $order !== null
            && $order->status === TicketOrderStatus::Cancelled;
    }

    public function rules(): array
    {
        return [];
    }
}
