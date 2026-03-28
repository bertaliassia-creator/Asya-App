<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBd.php';

$sql = "SELECT 
    r.id,
    c.nom,
    c.prenom,
    c.telephone,
    v.marque,
    v.modele,
    v.prix_jour,
    vi.image,
    r.date_debut,
    r.date_fin,
    r.statut
FROM reservations r
JOIN clients c ON r.client_id = c.id
JOIN voitures v ON r.voiture_id = v.id
LEFT JOIN voiture_images vi ON v.id = vi.voiture_id";

$res = $conn->query($sql);
$reservations = [];
while($row = $res->fetch(PDO::FETCH_ASSOC)){
    $reservations[] = $row;
}
echo json_encode($reservations);

?>