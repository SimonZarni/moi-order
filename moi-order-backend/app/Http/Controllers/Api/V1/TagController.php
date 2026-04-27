<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TagController extends Controller
{
    // GET /api/v1/tags — intentionally public, no auth required.
    public function index(): AnonymousResourceCollection
    {
        return TagResource::collection(Tag::orderBy('name_en')->get());
    }
}
