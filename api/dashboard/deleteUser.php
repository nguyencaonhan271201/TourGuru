<?php
    include "../db.php";
    include "../../shared/classes/User.php";
    
    if(isset($_POST['ID'])){
        $user = new User($conn);
        echo $user->deleteUser($_POST['ID']);
    } else echo 2;
?>