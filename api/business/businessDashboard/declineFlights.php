<?php
  session_start();
  require_once("../../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_POST["bookingID"])) {
    $bookingID = $_POST["bookingID"];

    $sql = "UPDATE flight_bookings SET status = 2 WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $bookingID);
    $stmt->execute();
    
    if($stmt->affected_rows == 1){
      http_response_code(200);
      exit;
    } else {
      http_response_code(400);
      exit;
    }
  } else {
    http_response_code(403);
    exit;
  }