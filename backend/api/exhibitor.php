<?php

header('Content-Type:application/json');

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    http_response_code(405);
    echo json_encode(['success' => false,'message'=>'Only POST is allowed.']);
    exit;
}

$data=json_decode(file_get_contents('php://input'),true);

if(!is_array($data)){
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Invalid JSON.']);
    exit;
}

$companyName = trim($data['exhibitorCompanyName'] ?? '');
$contactPerson = trim($data['exhibitorContactPerson'] ?? "");
$email = trim($data['exhibitorEmail']??'');
$phone = trim($data['exhibitorPhone']??'');
$industry = trim($data['exhibitorIndustry']??'');
$boothPackage=trim($data['exhibitorBoothPackage']??'');
$hasAcceptedTerms=$data['exhibitorTerms'] ?? false;

$allowedIndustries = ['tech','finance','engineering','healthcare','startups'];
$allowedBoothPackages=['standard','premium','platinum'];

$errors=[];

if($companyName === ''){
    $errors['exhibitorCompanyName']='Please enter company name.';
}

if($contactPerson === ''){
    $errors['exhibitorContactPerson']='Please enter a contact person.';
}

if($email === ''){
    $errors['exhibitorEmail'] ='Email is required.';
}else if (!filter_var($email,FILTER_VALIDATE_EMAIL)){
    $errors['exhibitorEmail']='Please enter a valid email address.';
}

if($phone === ''){
    $errors['exhibitorPhone']='Phone is required.';
}else{
    $digits = preg_replace('/[\s-]/', '', $phone);
    $digits = preg_replace('/^(\+?60|0)/', '', $digits);

    if (!preg_match('/^1\d{8,9}$/', $digits)) {
        $errors['exhibitorPhone'] = 'Enter a valid Malaysian mobile number.';
    }
}

if(!in_array($industry,$allowedIndustries,true)){
    $errors['exhibitorIndustry']='Please select an industry.';
}

if (!in_array($boothPackage, $allowedBoothPackages, true)) {
    $errors['exhibitorBoothPackage'] = 'Please select a booth package.';
}

if ($hasAcceptedTerms !== true) {
    $errors['exhibitorTerms'] = 'Please accept the exhibitor terms.';
}

if(count($errors)>0){
    http_response_code(422);
    echo json_encode(['success' =>false,'errors'=>$errors]);
    exit;
}

try{
    $pdo = require __DIR__ . '/../database.php';
    
    $statement = $pdo->prepare(
        'INSERT INTO exhibitor_applications (company_name, contact_person, email,phone,industry,booth_package) VALUES (?,?,?,?,?,?)'
    );

    $statement->execute([$companyName,$contactPerson,$email,$phone,$industry,$boothPackage]);

    echo json_encode(['success' => true]);
}catch (PDOException $exception){
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Could not save your application']);
}