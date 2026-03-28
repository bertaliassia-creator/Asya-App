<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// connexion
include 'ConnexionAuBd.php'; // خاص $conn يكون PDO

$data = json_decode(file_get_contents("php://input"), true);

$client_id  = $data['client_id'] ?? null;
$voiture_id = $data['voiture_id'] ?? null;
$date_debut = $data['date_debut'] ?? null;
$date_fin   = $data['date_fin'] ?? null;

if (!$client_id || !$voiture_id || !$date_debut || !$date_fin) {
    echo json_encode(["message" => "missing_data"]);
    exit();
}

try {

    // ✅ تحقق من availability
    $check = $conn->prepare("
        SELECT COUNT(*) FROM reservations 
        WHERE voiture_id = ?
        AND (
            (date_debut <= ? AND date_fin >= ?) OR
            (date_debut <= ? AND date_fin >= ?) OR
            (date_debut >= ? AND date_fin <= ?)
        )
    ");

    $check->execute([
        $voiture_id,
        $date_debut, $date_debut,
        $date_fin, $date_fin,
        $date_debut, $date_fin
    ]);

    if ($check->fetchColumn() > 0) {
        echo json_encode(["message" => "not_available"]);
        exit();
    }

    // ✅ insertion
    $stmt = $conn->prepare("
        INSERT INTO reservations (client_id, voiture_id, date_debut, date_fin)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->execute([
        $client_id,
        $voiture_id,
        $date_debut,
        $date_fin
    ]);

    echo json_encode(["message" => "success"]);

} catch (PDOException $e) {
    echo json_encode([
        "message" => "error",
        "error" => $e->getMessage()
    ]);
}
?>