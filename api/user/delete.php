<?php
    include "../../db.php";
    include "../../shared/classes/user.php";
    if(isset($_POST['userID'])){
        $user = new user();
        $user->setConn($conn);
        if($user->deleteUser($_POST['userID'])){
            return 1; //Xoa thanh cong
        } else return 0; //Xoa khong thanh cong
    } else return 2; //chua set du lieu 
?>