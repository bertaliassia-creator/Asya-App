<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBD.php';
$data = json_decode(file_get_contents('php://input'),true);
$email = $data['email'];
$password = $data['password'];
if(empty($email) || empty($password)){
    echo json_encode(
        ["success" => false , "message" => "Tous les champs sont obligatoires"]
    );
    exit();
}
$sql = "SELECT * FROM clients WHERE email = ?";
$stm = $conn->prepare($sql);
$stm->execute([$email]);
$client = $stm->fetch(PDO::FETCH_ASSOC);

if ($client){
    if(password_verify($password , $client['password'])){
        echo json_encode([
            "success"=>true,
            "message"=>"Login success",
            "client"=>[
                "id" => $client['id'],
                "nom"=>$client['nom'],
                "prenom"=>$client['prenom'],
                "email"=>$client['email'],
                "telephone"=>$client['telephone'],
                "region"=>$client['region_id'],
                "ville"=>$client['ville_id'],
                "role"=>$client['role']
            ]
                ]);
    }else{
        echo json_encode([
            "success" => false , "message" => "Password pas correct"
        ]);
    }
}else{
     echo json_encode([
            "success" => false , "message" => "Ce Email introuvable"
        ]);
}









?>