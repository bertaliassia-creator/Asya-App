<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBd.php';




    $voiture_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    $stmt = $conn->prepare("
        SELECT 
            v.id,
            v.marque,
            v.modele,
            v.prix_jour,
            v.annee,
            vi.image
        FROM voitures v
        LEFT JOIN voiture_images vi ON v.id = vi.voiture_id
        WHERE v.id = :id
    ");
    $stmt->execute(['id' => $voiture_id]);

    $voiture = $stmt->fetch();

    echo json_encode($voiture);


?>