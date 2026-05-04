<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\FoodOrderStatus;
use App\Models\FoodOrder;
use Illuminate\Foundation\Http\FormRequest;

class DeleteFoodOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = FoodOrder::where('user_id', $this->user()->id)
            ->find((int) $this->route('id'));

        return $order !== null
            && $order->status === FoodOrderStatus::Cancelled;
    }

    public function rules(): array
    {
        return [];
    }
}
