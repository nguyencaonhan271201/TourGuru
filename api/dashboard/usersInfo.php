<?php
    include "../../db.php";
    include "../../shared/classes/user.php";
    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new user($conn);

        return json_encode($info->getUserForDashboard($offset));
    } else return false;//chua set du lieu 
?>