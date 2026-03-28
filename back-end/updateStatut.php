<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'ConnexionAuBd.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$statut = $data["statut"];

$sql = "UPDATE reservations SET statut = ? WHERE id = ?";
$stm = $conn->prepare($sql);

if($stm->execute([$statut, $id])) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}