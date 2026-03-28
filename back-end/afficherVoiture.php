<?php

//accee
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "ConnexionAuBd.php";

$sql="SELECT * FROM voitures";
$resultat= $conn->query($sql);
$voitures = [];


while ($row = $resultat->fetch(PDO::FETCH_ASSOC)){
    $voitures[]=$row;
}

echo json_encode($voitures)


?>