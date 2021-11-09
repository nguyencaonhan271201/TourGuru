<?php
    include "../../db.php";
    include "../../shared/classes/hotels.php";
    if(isset($_POST['ID']) && isset($_POST['userID'])){
        $bookingID = $_POST['ID'];
        $userID = $_POST['userID'];
        $delete = new hotels($conn, $bookingID);

        return json_encode($delete->deleteBooking($userID));
    } else return false;//chua set du lieu 
?>