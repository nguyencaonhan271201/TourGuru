<?php
    include "../../db.php";
    include "../../shared/classes/location.php";
    if(isset($_POST['userID']) && isset($_POST['GeoID'])){
        $userID = $_POST['userID'];
        $locID = $_POST['GeoID'];
        $location = new location($conn);
        //var_dump($locaction->addVisited($userID, $locID));
        if($location->checkVisited($userID, $locID)){
            return $location->addVisited($userID, $locID);
        } else return 2; //vi tri da den nen khong add vao
    } else return 3;//chua set du lieu 
?>