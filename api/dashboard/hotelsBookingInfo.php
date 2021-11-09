<?php
    include "../../db.php";
    include "../../shared/classes/hotels.php";
    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new hotels($conn);

        return json_encode($info->getBookingInfo($offset));
    } else return false;//chua set du lieu 
?>