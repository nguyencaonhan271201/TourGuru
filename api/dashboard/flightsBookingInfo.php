<?php
    include "../../db.php";
    include "../../shared/classes/flights.php";
    // $info = new flights($conn);
    // echo json_encode($info->getBookingInfo(3));
    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new flights($conn);
        echo json_encode($info->getBookingInfo($offset));
    } else echo false;//chua set du lieu 
?>