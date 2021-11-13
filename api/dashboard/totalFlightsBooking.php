<?php
    include "../db.php";
    include "../../shared/classes/flights.php";
    if(isset($_GET['period'])){
        $period = $_GET['period'];
        $info = new flights($conn);
        echo json_encode($info->getTotalBooking($period));
    } else echo false;//chua set du lieu 
?>