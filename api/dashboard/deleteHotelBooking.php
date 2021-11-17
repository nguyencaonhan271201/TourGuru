<?php
    //include "../db.php";
    include "../../shared/classes/hotels.php";
    require_once("../../shared/classes/Database.php");

    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    if(isset($_POST['ID']) && isset($_POST['userID'])){
        $bookingID = $_POST['ID'];
        $userID = $_POST['userID'];
        $delete = new hotels($conn, $bookingID);
        echo json_encode($delete->deleteBooking($userID));
    } else echo 2;
?>