<?php
    //include "../db.php";
    include "../../shared/classes/hotels.php";
    require_once("../../shared/classes/Database.php");

    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    if(isset($_GET['period'])){
        $period = $_GET['period'];
        $info = new hotels($conn);
        //var_dump($info->getTotalBooking($period));
        echo json_encode($info->getTotalBooking($period));
    } else echo false;//chua set du lieu 
?>