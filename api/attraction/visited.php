<?php
    include "../db.php";
    include "../../shared/classes/location.php";
    if(isset($_GET['userID']) && isset($_GET['GeoID'])){
        $userID = $_GET['userID'];
        $locID = $_GET['GeoID'];
        $location = new location($conn);
        //var_dump($locaction->addVisited($userID, $locID));
        return $location->checkVisited($userID, $locID);
    } else return 2;//chua set du lieu 
?>