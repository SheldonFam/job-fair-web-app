<?php


header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST is allowed.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON.']);
    exit;
}

$sessionId = trim($data['reservationSessionId'] ?? '');
$name = trim($data['reservationName'] ?? '');
$email = trim($data['reservationEmail'] ?? '');
$phone = trim($data['reservationPhone'] ?? '');
$isWaitlist = $data['reservationIsWaitlist'] ?? false;

// the same session ids as src/data/sessions.ts
$allowedSessionIds = [
    'm11', 'm12', 'm13', 'm21', 'm22', 'm31', 'm32',
    't11', 't12', 't21', 't22', 't31', 't32',
];

$errors = [];

if (!in_array($sessionId, $allowedSessionIds, true)) {
    $errors['reservationSessionId'] = 'Please choose a valid session.';
}

if ($name === '') {
    $errors['reservationName'] = 'Please enter your full name.';
}

if ($email === '') {
    $errors['reservationEmail'] = 'Email is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['reservationEmail'] = 'Please enter a valid email address.';
}

if ($phone === '') {
    $errors['reservationPhone'] = 'Phone is required.';
} else {
    $digits = preg_replace('/[\s-]/', '', $phone);
    $digits = preg_replace('/^(\+?60|0)/', '', $digits);

    if (!preg_match('/^1\d{8,9}$/', $digits)) {
        $errors['reservationPhone'] = 'Enter a valid Malaysian mobile number.';
    }
}

if (count($errors) > 0) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// the database column stores 1 for waitlist and 0 for a normal reservation
$isWaitlistToSave = 0;

if ($isWaitlist === true) {
    $isWaitlistToSave = 1;
}

try {
    $pdo = require __DIR__ . '/../database.php';

    $statement = $pdo->prepare(
        'INSERT INTO reservations (session_id, name, email, phone, is_waitlist) VALUES (?, ?, ?, ?, ?)'
    );
    $statement->execute([$sessionId, $name, $email, $phone, $isWaitlistToSave]);

    echo json_encode(['success' => true]);
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not save your reservation.']);
}
