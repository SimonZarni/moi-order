<?php

declare(strict_types=1);

use App\Enums\KycApplicationStatus;
use App\Models\KycApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Laravel\Sanctum\Sanctum;

uses(DatabaseTransactions::class);

test('existing customer can apply to become a merchant', function (): void {
    $user = User::factory()->create(['is_merchant' => false]);
    Sanctum::actingAs($user, ['user']);

    $this->postJson('/api/v1/merchant/apply')
        ->assertOk()
        ->assertJsonPath('data.status', KycApplicationStatus::Draft->value)
        ->assertJsonPath('data.user_id', $user->id);

    $this->assertDatabaseHas('kyc_applications', [
        'user_id' => $user->id,
        'status'  => KycApplicationStatus::Draft->value,
    ]);
});

test('applying twice reuses the existing draft application', function (): void {
    $user = User::factory()->create(['is_merchant' => false]);
    Sanctum::actingAs($user, ['user']);

    $first  = $this->postJson('/api/v1/merchant/apply')->assertOk()->json('data.id');
    $second = $this->postJson('/api/v1/merchant/apply')->assertOk()->json('data.id');

    expect($second)->toBe($first);
    expect(KycApplication::forUser($user->id)->count())->toBe(1);
});

test('an existing merchant cannot re-apply', function (): void {
    $user = User::factory()->create(['is_merchant' => true]);
    Sanctum::actingAs($user, ['user']);

    $this->postJson('/api/v1/merchant/apply')
        ->assertStatus(409)
        ->assertJson(['code' => 'merchant.already_merchant']);
});

test('apply requires authentication', function (): void {
    $this->postJson('/api/v1/merchant/apply')
        ->assertStatus(401);
});

test('status returns null when no application exists', function (): void {
    $user = User::factory()->create(['is_merchant' => false]);
    Sanctum::actingAs($user, ['user']);

    $this->getJson('/api/v1/merchant/apply')
        ->assertOk()
        ->assertJsonPath('data', null);
});

test('status returns the latest application', function (): void {
    $user = User::factory()->create(['is_merchant' => false]);
    Sanctum::actingAs($user, ['user']);

    $this->postJson('/api/v1/merchant/apply')->assertOk();

    $this->getJson('/api/v1/merchant/apply')
        ->assertOk()
        ->assertJsonPath('data.status', KycApplicationStatus::Draft->value)
        ->assertJsonPath('data.user_id', $user->id);
});

test('a draft application can be cancelled', function (): void {
    $user = User::factory()->create(['is_merchant' => false]);
    Sanctum::actingAs($user, ['user']);

    $this->postJson('/api/v1/merchant/apply')->assertOk();

    $this->deleteJson('/api/v1/merchant/apply')->assertNoContent();

    $this->assertSoftDeleted('kyc_applications', [
        'user_id' => $user->id,
        'status'  => KycApplicationStatus::Draft->value,
    ]);

    $this->getJson('/api/v1/merchant/apply')
        ->assertOk()
        ->assertJsonPath('data', null);
});

test('cancelling without an application returns 404', function (): void {
    $user = User::factory()->create(['is_merchant' => false]);
    Sanctum::actingAs($user, ['user']);

    $this->deleteJson('/api/v1/merchant/apply')
        ->assertStatus(404)
        ->assertJson(['code' => 'kyc.application_not_found']);
});

test('a submitted application cannot be cancelled', function (): void {
    $user = User::factory()->create(['is_merchant' => false]);
    Sanctum::actingAs($user, ['user']);

    $application = KycApplication::create([
        'user_id'          => $user->id,
        'business_name'    => 'Test Shop',
        'business_type'    => 'restaurant',
        'business_address' => '123 Test St',
        'status'           => KycApplicationStatus::Submitted,
    ]);

    $this->deleteJson('/api/v1/merchant/apply')
        ->assertStatus(409)
        ->assertJson(['code' => 'kyc.cannot_cancel']);

    $this->assertDatabaseHas('kyc_applications', [
        'id'     => $application->id,
        'status' => KycApplicationStatus::Submitted->value,
    ]);
});
