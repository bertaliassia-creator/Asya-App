<?php

//accee
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include "ConnexionAuBd.php";

$sql="SELECT * FROM clients WHERE role = 'user'" ;
$resultat= $conn->query($sql);
$clients = [];


while ($row = $resultat->fetch(PDO::FETCH_ASSOC)){
    $clients[]=$row;
}

echo json_encode($clients)


?>