<?php
    // include "../db.php";
    include "../../shared/classes/User.php";
    require_once("../../shared/classes/Database.php");

    $db = Database::getInstance();
    $conn = $db->getConnection();

    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new User($conn);
        echo json_encode($info->getUserForDashboard($offset));
    } else echo false;//chua set du lieu 
?>