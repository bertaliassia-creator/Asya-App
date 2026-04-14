<?php
header("Access-Control-Allow-Origin: http://localhost:3002"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
include "ConnexionAuBd.php";

// 🚨 إذا preflight (OPTIONS) فقط
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"];

$sql = "
SELECT r.*, c.nom, c.prenom, c.email, c.telephone,
       v.marque, v.modele,
       vi.image
FROM reservations r
JOIN clients c ON r.client_id = c.id
JOIN voitures v ON r.voiture_id = v.id
LEFT JOIN voiture_images vi ON v.id = vi.voiture_id
WHERE r.id = ?
";

$stm = $conn->prepare($sql);
$stm->execute([$id]);

echo json_encode($stm->fetch(PDO::FETCH_ASSOC));