<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ مهم بزاف: التعامل مع preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");

include 'ConnexionAuBd.php';

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data["id"])) {
    echo json_encode([]);
    exit;
}

$id = $data["id"];

$sql = "
SELECT 
    r.id,
    r.date_debut,
    r.date_fin,
    r.statut,
    v.marque,
    v.modele,
    v.prix_jour,
    vi.image
FROM reservations r
INNER JOIN voitures v ON r.voiture_id = v.id
LEFT JOIN voiture_images vi ON v.id = vi.voiture_id
WHERE r.client_id = ?
";

$stm = $conn->prepare($sql);
$stm->execute([$id]);
$result = $stm->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);

?>