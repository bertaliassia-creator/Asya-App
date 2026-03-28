<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBd.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ;

$sql = "DELETE FROM clients WHERE id = ?";
$stm = $conn->prepare($sql);
$stm->execute([$id]);

echo json_encode([
    "success" => true , "message" => "Le client a été bien supprimer"
]);



?>