<?php
    include "../../db.php";
    include "../../shared/classes/hotels.php";
    if(isset($_GET['period'])){
        $period = $_GET['period'];
        $info = new hotels($conn);
        //var_dump($info->getTotalBooking($period));
        return json_encode($info->getTotalBooking($period));
    } else return false;//chua set du lieu 
?>