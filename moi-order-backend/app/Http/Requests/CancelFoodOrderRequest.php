<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\FoodOrderStatus;
use App\Models\FoodOrder;
use Illuminate\Foundation\Http\FormRequest;

class CancelFoodOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = FoodOrder::where('user_id', $this->user()->id)
            ->where('uuid', $this->route('id'))
            ->first();

        return $order !== null
            && $order->status === FoodOrderStatus::OrderPlaced;
    }

    public function rules(): array
    {
        return [];
    }
}
