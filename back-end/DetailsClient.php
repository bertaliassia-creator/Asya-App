<?php


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBd.php';
$data = json_decode(file_get_contents("php://input"),true);
$id = $data["id"];


$sql = "SELECT * FROM reservations r INNER JOIN clients c ON r.client_id = c.id  WHERE r.client_id = ?";
$stm = $conn->prepare($sql);
$stm->execute([$id]);
$fullDetails = $stm->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($fullDetails);


?>