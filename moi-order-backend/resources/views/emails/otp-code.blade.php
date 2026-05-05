<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Moi Order Code</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 40px 16px; color: #111; }
        .wrapper { max-width: 480px; margin: 0 auto; }
        .card { background: #fff; border-radius: 12px; padding: 40px 32px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        .logo { font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #111; margin-bottom: 32px; }
        .heading { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .subtext { font-size: 14px; color: #6b7280; margin-bottom: 32px; line-height: 1.6; }
        .code-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; text-align: center; padding: 24px; margin-bottom: 16px; }
        .code { font-size: 44px; font-weight: 900; letter-spacing: 14px; color: #111; font-family: monospace; }
        .expiry { font-size: 13px; color: #6b7280; margin-bottom: 32px; }
        .footer { font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 20px; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="logo">MOI ORDER</div>
            <div class="heading">Your verification code</div>
            <p class="subtext">Use the code below to verify your email address. Do not share this code with anyone.</p>
            <div class="code-box">
                <div class="code">{{ $code }}</div>
            </div>
            <p class="expiry">This code expires in {{ $expiresInMinutes }} minutes.</p>
            <div class="footer">
                If you did not request this code, you can safely ignore this email.<br>
                &copy; {{ date('Y') }} Moi Order. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
