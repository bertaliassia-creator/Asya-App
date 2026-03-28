<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include "ConnexionAuBd.php";

try {

    // 1️⃣ insert voiture
    $stmt = $conn->prepare("INSERT INTO voitures (marque, modele, annee, prix_jour) VALUES (?, ?, ?, ?)");
    $stmt->execute([$marque, $modele, $annee, $prix]);

    // récupérer id voiture
    $voiture_id = $conn->lastInsertId();

    // 2️⃣ upload images
    if (isset($_FILES['images'])) {

        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {

            $image_name = time() . "_" . $_FILES['images']['name'][$key];
            $destination = "uploads/" . $image_name;

            move_uploaded_file($tmp_name, $destination);

            // insert image
            $stmt = $conn->prepare("INSERT INTO voiture_images (voiture_id, image) VALUES (?, ?)");
            $stmt->execute([$voiture_id, $image_name]);
        }
    }

    echo json_encode(["message" => "Voiture ajoutée avec succès"]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>