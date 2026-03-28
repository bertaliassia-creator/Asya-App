<?php
//KAN3TI ACCESS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// IMPORT CONNEXION AU BD
include 'ConnexionAuBd.php';
//getVille
$sqlVille = "SELECT * FROM ville";
$resultatVille = $conn->query($sqlVille);
$ville = [];
while ($row = $resultatVille->fetch(PDO::FETCH_ASSOC)){
    $ville[] = $row;
}

echo json_encode($ville)




?>