<?php
    include "../../db.php";
    include "../../shared/classes/location.php";
    if(isset($_POST['userID']) && isset($_POST['GeoID'])){
        $userID = $_POST['userID'];
        $locID = $_POST['GeoID'];
        $location = new location($conn);
        //var_dump($locaction->addVisited($userID, $locID));
        if($location->checkVisited($userID, $locID)){
            echo $location->addVisited($userID, $locID);
        } else{
            echo $location->removeVisited($userID, $locID);
            //2 xoa thanh cong
        }
    } else echo 3;//chua set du lieu 
?>