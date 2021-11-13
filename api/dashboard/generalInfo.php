<?php

include "../db.php";
include "../../shared/classes/hotels.php";
if(isset($_GET['user_id']) && isset($_GET['isAdmin'])){
  $query = "SELECT * FROM users WHERE user_id = ? AND role = 0";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("s", $_GET['user_id']);
  $stmt->execute();
  $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

  if (count($result) != 1) {
    http_response_code(403);
  }

  //Validated being admin
  $query = "SELECT * FROM
  (SELECT COUNT(*) AS flight FROM flight_bookings) AS C1
  JOIN (SELECT COUNT(*) AS hotel FROM hotel_bookings) AS C2
  JOIN (SELECT COUNT(*) AS visited FROM visited_locations) AS C3";
  $stmt = $conn->prepare($query);
  $stmt->execute();
  $result = $stmt->get_result()->fetch_assoc();
  echo json_encode($result);
  
} else {
  http_response_code(400);
}