<?php
    //include "../db.php";
    include "../../shared/classes/flights.php";
    require_once("../../shared/classes/Database.php");

    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new flights($conn);

        echo json_encode($info->getBookingInfo($offset));
    } else echo false;//chua set du lieu 
?>