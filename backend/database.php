<?php

$config = require __DIR__ . '/config.php';

$pdo = new PDO(
    'mysql:host=' . $config['databaseHost'] . ';dbname=' . $config['databaseName'] . ';charset=utf8mb4',
    $config['databaseUser'],
    $config['databasePassword'],
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
);

return $pdo;