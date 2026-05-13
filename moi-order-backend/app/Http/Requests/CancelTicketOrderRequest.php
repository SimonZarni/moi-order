<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\TicketOrderStatus;
use App\Models\TicketOrder;
use Illuminate\Foundation\Http\FormRequest;

class CancelTicketOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = TicketOrder::where('user_id', $this->user()->id)
            ->where('uuid', $this->route('id'))
            ->first();

        return $order !== null
            && $order->status === TicketOrderStatus::PendingPayment;
    }

    public function rules(): array
    {
        return [];
    }
}
