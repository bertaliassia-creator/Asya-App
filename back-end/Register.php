<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBD.php';




$data = json_decode(file_get_contents("php://input"),true);


$nom = $data['nom'];
$prenom = $data['prenom'];
$email = $data['email'];
$telephone = $data['telephone'];
$region = $data['region'];
$ville = $data['ville'];
$password =  password_hash($data['password'] , PASSWORD_DEFAULT); // masquer password ;
if(
    empty($nom) ||
    empty($prenom) ||
    empty($region) ||
    empty($ville) ||
    empty($telephone) ||
    empty($email) ||
    empty($password)
){
    echo json_encode(["success" => false ,"message" => "Tous les champs sont obligatoires"]);
    exit();
}


$sql = "INSERT INTO clients(nom , prenom , email , telephone , region_id , ville_id , password) VALUES (?,?,?,?,?,?,?)";
$stm = $conn->prepare($sql);
if ($stm->execute([$nom, $prenom,$email,$telephone ,$region , $ville, $password])) {
    echo json_encode([ "success" => true ,  "message" => "Vous avez bien registree"]);
    }else {
        echo json_encode([ "success" => false , "message" => "error"]);
    }
?>