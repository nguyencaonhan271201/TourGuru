<?php
    include "../db.php";
    include "../../shared/classes/location.php";
    if(isset($_POST['userID']) && isset($_POST['geoID'])
    && isset($_POST['long']) && isset($_POST['lat'])
    && isset($_POST['region'])){
        $userID = $_POST['userID'];
        $locID = $_POST['geoID'];
        $long = $_POST['long'];
        $lat = $_POST['lat'];
        $region = $_POST['region'];
        $title = $_POST['title'];
        $location = new location($conn);
        if($location->checkVisited($userID, $locID)){
            echo $location->addVisited($userID, $locID, $long, $lat, $region, $title);
        } else{
            echo $location->removeVisited($userID, $locID);
        }
    } else echo 3;
?>