<?php
header("Access-Control-Allow-Origin: *");

$pdo = new PDO("mysql:host=localhost;dbname=location_voiture;charset=utf8", "root", "");

$sql = "SELECT v.*, i.image 
        FROM voitures v
        LEFT JOIN voiture_images i ON v.id = i.voiture_id
        GROUP BY v.id";

$stmt = $pdo->query($sql);

$voitures = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($voitures);