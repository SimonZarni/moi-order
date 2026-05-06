<?php

declare(strict_types=1);

namespace App\Mail;

use App\Enums\EmailOtpPurpose;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailOtpMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string          $otp,
        public readonly EmailOtpPurpose $purpose,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: match ($this->purpose) {
                EmailOtpPurpose::Registration  => 'Verify your Moi Order email',
                EmailOtpPurpose::PasswordReset => 'Reset your Moi Order password',
            },
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.otp');
    }

    /** @return array<int, \Illuminate\Mail\Mailables\Attachment> */
    public function attachments(): array
    {
        return [];
    }
}
