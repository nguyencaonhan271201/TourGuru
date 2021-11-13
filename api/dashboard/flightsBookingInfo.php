<?php
    include "../../db.php";
    include "../../shared/classes/flights.php";
    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new flights($conn);

        echo json_encode($info->getBookingInfo($offset));
    } else echo false;//chua set du lieu 
?>