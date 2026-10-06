<?php


header('Content-Type:application/json');

if($_SERVER['REQUEST_METHOD'] !=='POST'){
    http_response_code(405);
    echo json_encode(['success' =>false, 'message'=>'Only POST is allowed.']);
    exit;
}

$data =json_decode(file_get_contents('php://input'),true);

if(!is_array($data)){
    http_response_code(400);
    echo json_encode(['success' => false,'message'=>'Invalid JSON.']);
    exit;
}

$name = trim($data['contactName'] ?? '');
$email = trim($data['contactEmail'] ?? '');
$phone = trim($data['contactPhone'] ?? '');
$subject = trim($data['contactSubject']?? '');
$message = trim($data['contactMessage'] ?? '');

$errors = [];

if($name === ''){
$errors['contactName']='Please enter your full name.';
}

if($email === ''){
    $errors['contactEmail']='Email is required.';
}elseif(!filter_var($email,FILTER_VALIDATE_EMAIL)){
    $errors['contactEmail']='Please enter a valid email address.';
} 

if($phone !==''){
    $digits = preg_replace('/[\s-]/', '', $phone);
    $digits = preg_replace('/^(\+?60|0)/', '', $digits);

    if(!preg_match('/^1\d{8,9}$/', $digits)){
    $errors['contactPhone'] = 'Enter a valid Malaysian mobile number.';
    }
}

if($subject=== ''){
    $errors['contactSubject']='Please choose a subject.';
}

if(mb_strlen($message) < 10){
    $errors['contactMessage']='Message must be at least 10 characters.';
}

if(count($errors)>0){
    http_response_code(422);
    echo json_encode(['success' => false,'errors'=>$errors ]);
    exit;
}

$phoneToSave=null;

if($phone !== ''){
    $phoneToSave = $phone;
}


try{
    $pdo = require __DIR__ . '/../database.php';

    $statement = $pdo->prepare(
        'INSERT INTO contact_messages (name,email,phone,subject,message) VALUES (?,?,?,?,?)'
    );
    $statement->execute([$name,$email,$phoneToSave,$subject,$message]);

    echo json_encode(['success'=>true]);
}catch (PDOException $exception){
    http_response_code(500);
    echo json_encode(['success' => false,'message'=>'Could not save your message.']);
}

