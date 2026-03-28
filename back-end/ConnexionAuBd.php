<?php

 try {
        $conn = new PDO('mysql:host=localhost;dbname=location_voiture','root','');
    } catch (PDOException $ex) {
        echo $ex->getMessage();
    }
?>