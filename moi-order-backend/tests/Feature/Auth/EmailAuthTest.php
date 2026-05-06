<?php

declare(strict_types=1);

use App\Enums\EmailOtpPurpose;
use App\Mail\EmailOtpMail;
use App\Models\EmailOtp;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

uses(DatabaseTransactions::class);

// ── send-otp ──────────────────────────────────────────────────────────────────

test('send otp queues email for registration', function (): void {
    Mail::fake();

    $this->postJson('/api/v1/auth/email/send-otp', [
        'email'   => 'user@example.com',
        'purpose' => 'registration',
    ])->assertOk()
      ->assertJsonStructure(['data' => ['expires_in', 'resend_after']]);

    Mail::assertQueued(EmailOtpMail::class, function (EmailOtpMail $mail): bool {
        return $mail->purpose === EmailOtpPurpose::Registration;
    });

    expect(EmailOtp::where('email', 'user@example.com')->count())->toBe(1);
});

test('send otp respects 30-second resend cooldown', function (): void {
    Mail::fake();

    $this->postJson('/api/v1/auth/email/send-otp', ['email' => 'user@example.com', 'purpose' => 'registration'])
         ->assertOk();

    $this->postJson('/api/v1/auth/email/send-otp', ['email' => 'user@example.com', 'purpose' => 'registration'])
         ->assertStatus(409)
         ->assertJson(['code' => 'otp.resend_too_soon']);
});

test('send otp for password reset always returns 200 even if email does not exist', function (): void {
    Mail::fake();

    $this->postJson('/api/v1/auth/email/send-otp', [
        'email'   => 'nonexistent@example.com',
        'purpose' => 'password_reset',
    ])->assertOk();

    Mail::assertQueued(EmailOtpMail::class);
});

test('send otp validates email format', function (): void {
    $this->postJson('/api/v1/auth/email/send-otp', ['email' => 'not-an-email', 'purpose' => 'registration'])
         ->assertUnprocessable()
         ->assertJsonValidationErrors(['email']);
});

// ── verify-otp ────────────────────────────────────────────────────────────────

test('verify otp returns verified token on correct code', function (): void {
    $plain = '123456';
    EmailOtp::create([
        'email'      => 'user@example.com',
        'otp'        => Hash::make($plain),
        'purpose'    => 'registration',
        'expires_at' => now()->addMinutes(10),
        'attempts'   => 0,
    ]);

    $this->postJson('/api/v1/auth/email/verify-otp', [
        'email'   => 'user@example.com',
        'otp'     => $plain,
        'purpose' => 'registration',
    ])->assertOk()
      ->assertJsonStructure(['data' => ['verified_token', 'expires_in']]);

    expect(EmailOtp::where('email', 'user@example.com')->whereNotNull('verified_at')->exists())->toBeTrue();
});

test('verify otp rejects wrong code and increments attempts', function (): void {
    EmailOtp::create([
        'email'      => 'user@example.com',
        'otp'        => Hash::make('123456'),
        'purpose'    => 'registration',
        'expires_at' => now()->addMinutes(10),
        'attempts'   => 0,
    ]);

    $this->postJson('/api/v1/auth/email/verify-otp', [
        'email'   => 'user@example.com',
        'otp'     => '000000',
        'purpose' => 'registration',
    ])->assertUnprocessable()
      ->assertJsonValidationErrors(['otp']);

    expect(EmailOtp::where('email', 'user@example.com')->first()->attempts)->toBe(1);
});

test('verify otp rejects expired code', function (): void {
    EmailOtp::create([
        'email'      => 'user@example.com',
        'otp'        => Hash::make('123456'),
        'purpose'    => 'registration',
        'expires_at' => now()->subMinute(),
        'attempts'   => 0,
    ]);

    $this->postJson('/api/v1/auth/email/verify-otp', [
        'email'   => 'user@example.com',
        'otp'     => '123456',
        'purpose' => 'registration',
    ])->assertUnprocessable()
      ->assertJsonValidationErrors(['otp']);
});

test('verify otp locks out after 5 failed attempts', function (): void {
    EmailOtp::create([
        'email'      => 'user@example.com',
        'otp'        => Hash::make('123456'),
        'purpose'    => 'registration',
        'expires_at' => now()->addMinutes(10),
        'attempts'   => 5,
    ]);

    $this->postJson('/api/v1/auth/email/verify-otp', [
        'email'   => 'user@example.com',
        'otp'     => '123456',
        'purpose' => 'registration',
    ])->assertUnprocessable()
      ->assertJsonValidationErrors(['otp']);
});

// ── complete registration ─────────────────────────────────────────────────────

test('complete registration creates verified user and returns token', function (): void {
    $token = (string) Str::uuid();
    EmailOtp::create([
        'email'                     => 'new@example.com',
        'otp'                       => Hash::make('123456'),
        'purpose'                   => 'registration',
        'expires_at'                => now()->addMinutes(10),
        'verified_at'               => now(),
        'verified_token'            => $token,
        'verified_token_expires_at' => now()->addMinutes(15),
        'attempts'                  => 0,
    ]);

    $this->postJson('/api/v1/auth/email/register', [
        'email'                 => 'new@example.com',
        'name'                  => 'John Doe',
        'password'              => 'secret123',
        'password_confirmation' => 'secret123',
        'verified_token'        => $token,
    ])->assertCreated()
      ->assertJsonStructure(['data' => ['user', 'token']]);

    $user = User::where('email', 'new@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->email_verified_at)->not->toBeNull();

    // Token is consumed — second call must fail
    $this->postJson('/api/v1/auth/email/register', [
        'email'                 => 'new2@example.com',
        'name'                  => 'Jane Doe',
        'password'              => 'secret123',
        'password_confirmation' => 'secret123',
        'verified_token'        => $token,
    ])->assertUnprocessable()
      ->assertJsonValidationErrors(['verified_token']);
});

test('complete registration rejects duplicate email', function (): void {
    User::factory()->create(['email' => 'existing@example.com', 'email_verified_at' => now()]);

    $token = (string) Str::uuid();
    EmailOtp::create([
        'email'                     => 'existing@example.com',
        'otp'                       => Hash::make('123456'),
        'purpose'                   => 'registration',
        'expires_at'                => now()->addMinutes(10),
        'verified_at'               => now(),
        'verified_token'            => $token,
        'verified_token_expires_at' => now()->addMinutes(15),
        'attempts'                  => 0,
    ]);

    $this->postJson('/api/v1/auth/email/register', [
        'email'                 => 'existing@example.com',
        'name'                  => 'John Doe',
        'password'              => 'secret123',
        'password_confirmation' => 'secret123',
        'verified_token'        => $token,
    ])->assertStatus(409)
      ->assertJson(['code' => 'email.already_registered']);
});

// ── login ─────────────────────────────────────────────────────────────────────

test('login succeeds for verified email user', function (): void {
    User::factory()->create([
        'email'             => 'verified@example.com',
        'password'          => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email'    => 'verified@example.com',
        'password' => 'password123',
    ])->assertOk()
      ->assertJsonStructure(['data' => ['user', 'token']]);
});

test('login rejects unverified email user with 409', function (): void {
    User::factory()->create([
        'email'             => 'unverified@example.com',
        'password'          => Hash::make('password123'),
        'email_verified_at' => null,
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email'    => 'unverified@example.com',
        'password' => 'password123',
    ])->assertStatus(409)
      ->assertJson(['code' => 'email.not_verified']);
});

test('login rejects wrong password with 422', function (): void {
    User::factory()->create([
        'email'             => 'user@example.com',
        'password'          => Hash::make('correct'),
        'email_verified_at' => now(),
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email'    => 'user@example.com',
        'password' => 'wrong',
    ])->assertUnprocessable()
      ->assertJsonValidationErrors(['email']);
});

// ── reset password ────────────────────────────────────────────────────────────

test('reset password sets new password and revokes tokens', function (): void {
    $user = User::factory()->create([
        'email'             => 'user@example.com',
        'password'          => Hash::make('oldpassword'),
        'email_verified_at' => now(),
    ]);
    $user->createToken('old-token', ['user']);

    $token = (string) Str::uuid();
    EmailOtp::create([
        'email'                     => 'user@example.com',
        'otp'                       => Hash::make('123456'),
        'purpose'                   => 'password_reset',
        'expires_at'                => now()->addMinutes(10),
        'verified_at'               => now(),
        'verified_token'            => $token,
        'verified_token_expires_at' => now()->addMinutes(15),
        'attempts'                  => 0,
    ]);

    $this->postJson('/api/v1/auth/email/reset-password', [
        'email'                 => 'user@example.com',
        'password'              => 'newpassword123',
        'password_confirmation' => 'newpassword123',
        'verified_token'        => $token,
    ])->assertNoContent();

    expect(Hash::check('newpassword123', $user->fresh()->password))->toBeTrue();
    expect($user->tokens()->count())->toBe(0);
});

test('reset password is enumeration-safe for unknown email', function (): void {
    $token = (string) Str::uuid();
    EmailOtp::create([
        'email'                     => 'ghost@example.com',
        'otp'                       => Hash::make('123456'),
        'purpose'                   => 'password_reset',
        'expires_at'                => now()->addMinutes(10),
        'verified_at'               => now(),
        'verified_token'            => $token,
        'verified_token_expires_at' => now()->addMinutes(15),
        'attempts'                  => 0,
    ]);

    $this->postJson('/api/v1/auth/email/reset-password', [
        'email'                 => 'ghost@example.com',
        'password'              => 'newpassword123',
        'password_confirmation' => 'newpassword123',
        'verified_token'        => $token,
    ])->assertNoContent();
});

test('reset password rejects expired verified token', function (): void {
    $token = (string) Str::uuid();
    EmailOtp::create([
        'email'                     => 'user@example.com',
        'otp'                       => Hash::make('123456'),
        'purpose'                   => 'password_reset',
        'expires_at'                => now()->addMinutes(10),
        'verified_at'               => now(),
        'verified_token'            => $token,
        'verified_token_expires_at' => now()->subMinute(),
        'attempts'                  => 0,
    ]);

    $this->postJson('/api/v1/auth/email/reset-password', [
        'email'                 => 'user@example.com',
        'password'              => 'newpassword123',
        'password_confirmation' => 'newpassword123',
        'verified_token'        => $token,
    ])->assertUnprocessable()
      ->assertJsonValidationErrors(['verified_token']);
});
