<?php
    include "../../db.php";
    include "../../shared/classes/location.php";
    if(isset($_POST['userID']) && isset($_POST['GeoID'])){
        $userID = $_POST['userID'];
        $locID = $_POST['GeoID'];
        $location = new location($conn);
        //var_dump($locaction->addVisited($userID, $locID));
        return $location->checkVisited($userID, $locID);
    } else return 2;//chua set du lieu 
?>