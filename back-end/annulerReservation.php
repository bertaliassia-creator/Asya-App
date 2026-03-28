<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBd.php'; // الربط مع قاعدة البيانات

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID manquant']);
    exit;
}

$reservationId = intval($data['id']);

try {
    // تحديث statut لـ "annule"
    $sql = "UPDATE reservations SET statut = 'annulée' WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$reservationId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Réservation annulée avec succès']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Réservation introuvable ou déjà annulée']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur serveur: ' . $e->getMessage()]);
}