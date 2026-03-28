<?php 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'ConnexionAuBd.php';

$sql = "SELECT * FROM region";
$res =  $conn->query($sql);

$region = [];

while($row = $res->fetch(PDO::FETCH_ASSOC)){
    $region[] = $row;
}
 echo json_encode($region)
?>
