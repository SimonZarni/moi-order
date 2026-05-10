@php
    header('Content-Type: application/json');
    echo json_encode([
        'status'      => 'maintenance',
        'message'     => 'System Upgrade',
        'details'     => 'Moi Order is getting better! We are updating our services. Please check back shortly.',
        'retry_after' => 3600,
    ]);
    exit;
@endphp
