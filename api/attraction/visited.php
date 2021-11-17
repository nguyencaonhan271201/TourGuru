<?php
    //include "../db.php";
    include "../../shared/classes/location.php";
    require_once("../../shared/classes/Database.php");

    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    if(isset($_GET['userID']) && isset($_GET['geoID'])){
        $userID = $_GET['userID'];
        $locID = $_GET['geoID'];
        $location = new location($conn);
        echo $location->checkVisited($userID, $locID);
    } else echo 2;
?>