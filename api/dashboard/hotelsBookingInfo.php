<?php
    include "../../db.php";
    include "../../shared/classes/hotels.php";
    $info = new hotels($conn);

        echo json_encode($info->getBookingInfo(2));
    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new hotels($conn);

        echo json_encode($info->getBookingInfo($offset));
    } else echo false;//chua set du lieu 
?>