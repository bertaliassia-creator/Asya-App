<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBd.php';

$data = json_decode(file_get_contents("php://input"), true);

// تحقق من id
if (!isset($data["id"])) {
    echo json_encode([]);
    exit;
}

$id = $data["id"];

// ✅ query مصححة
$sql = "SELECT 
    r.*,
    v.marque,
    v.modele,
    v.prix_jour,
    DATEDIFF(r.date_fin, r.date_debut) * v.prix_jour AS prix_total,
    vi.image
FROM reservations r
JOIN voitures v ON r.voiture_id = v.id
LEFT JOIN voiture_images vi ON v.id = vi.voiture_id
WHERE r.client_id = ?
ORDER BY r.date_debut DESC";

$stm = $conn->prepare($sql);
$stm->execute([$id]);

$reservations = $stm->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($reservations);