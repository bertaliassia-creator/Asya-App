<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBD.php';

$data = json_decode(file_get_contents("php://input"), true);

$nom = $data['nom'] ?? "";
$prenom = $data['prenom'] ?? "";
$email = $data['email'] ?? "";
$telephone = $data['telephone'] ?? "";
$region_id = $data['region_id'] ?? "";
$ville_id = $data['ville_id'] ?? "";
$id = $data['id'] ?? null;

$stmt = $conn->prepare("
    UPDATE clients 
    SET nom = :nom, 
        prenom = :prenom, 
        email = :email, 
        telephone = :telephone, 
        region_id = :region_id,  
        ville_id = :ville_id
    WHERE id = :id
");

$stmt->execute([
    ":nom" => $nom,
    ":prenom" => $prenom,
    ":email" => $email,
    ":telephone" => $telephone,
    ":region_id" => $region_id,
    ":ville_id" => $ville_id,
    ":id" => $id
]);

echo json_encode([
    "success" => true,
    "message" => "Client mis à jour avec succès"
]);