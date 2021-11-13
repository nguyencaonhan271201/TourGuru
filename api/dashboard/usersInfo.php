<?php
    include "../../db.php";
    include "../../shared/classes/user.php";
    if(isset($_GET['offset'])){
        $offset = $_GET['offset'];
        $info = new user($conn);
        echo json_encode($info->getUserForDashboard($offset));
    } else echo false;//chua set du lieu 
?>