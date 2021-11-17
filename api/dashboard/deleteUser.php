<?php
    //include "../db.php";
    include "../../shared/classes/User.php";
    require_once("../../shared/classes/Database.php");

    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    if(isset($_POST['ID'])){
        $user = new User($conn);
        echo $user->deleteUser($_POST['ID']);
    } else echo 2;
?>