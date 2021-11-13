<?php
    include "../db.php";
    include "../../shared/classes/User.php";
    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new User($conn);
        echo json_encode($info->getUserForDashboard($offset));
    } else echo false;//chua set du lieu 
?>