<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          {{-- Header --}}
          <tr>
            <td style="background:#1f3f3d;padding:28px 32px;">
              <p style="margin:0;font-size:11px;font-weight:700;color:#52796f;letter-spacing:4px;text-transform:uppercase;">Moi Order</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#ffffff;">
                @if($purpose === \App\Enums\EmailOtpPurpose::Registration)
                  Verify your email
                @else
                  Reset your password
                @endif
              </h1>
            </td>
          </tr>

          {{-- Body --}}
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
                @if($purpose === \App\Enums\EmailOtpPurpose::Registration)
                  Use the code below to verify your email address and complete your registration.
                @else
                  Use the code below to reset your Moi Order password.
                @endif
              </p>

              {{-- OTP box --}}
              <div style="background:#f1f5f9;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:12px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Your verification code</p>
                <p style="margin:0;font-size:40px;font-weight:900;letter-spacing:12px;color:#1f3f3d;">{{ $otp }}</p>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                This code expires in <strong>10 minutes</strong>.
              </p>
              <p style="margin:0;font-size:13px;color:#64748b;">
                If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          {{-- Footer --}}
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Moi Order &mdash; Immigration Services &middot; noreply@moiorder.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
