<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBD.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$marque = $data['marque'] ?? "";
$modele = $data['modele'] ?? "";
$annee = $data['annee'] ?? "";
$prix_jour = $data['prix_jour'] ?? "";

$stmt = $conn->prepare("UPDATE voitures SET marque = :marque, modele = :modele, annee = :annee, prix_jour = :prix_jour WHERE id = :id");

$stmt->execute([
    ":marque" => $marque,
    ":modele" => $modele,
    ":annee" => $annee,
    ":prix_jour" => $prix_jour,
    ":id" => $id
]);

// ما يكون حتى echo قبل هاد السطر
echo json_encode([
    "success" => true,
    "message" => "Voiture mise à jour avec succès"
]);