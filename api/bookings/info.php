<?php
  session_start();
  require_once ("../db.php");
  include('../../shared/classes/FlightBooking.php');
  include('../../shared/classes/HotelBooking.php');

  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["getFlightsInfo"])) {
      $booking = new FlightBooking($conn);
      if (!isset($_GET["user_id"]) || !isset($_GET["booking_id"])) {
        http_response_code(400);
        exit;
      }
      
      $info = $booking->getFlightBookingInfo($_GET["user_id"], $_GET["booking_id"]);

      if (empty($info)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($info);
      }
    } else if (isset($_GET["getFlightsPax"])) {
      $booking = new FlightBooking($conn);
      if (!isset($_GET["user_id"]) || !isset($_GET["booking_id"])) {
        http_response_code(400);
        exit;
      }
      
      $pax = $booking->getFlightBookingPax($_GET["user_id"], $_GET["booking_id"]);

      if (empty($pax)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($pax);
      }
    } else if (isset($_GET["getHotelsInfo"])) {
      $booking = new HotelBooking($conn);
      if (!isset($_GET["user_id"]) || !isset($_GET["booking_id"])) {
        http_response_code(400);
        exit;
      }
      
      $info = $booking->getHotelBookingInfo($_GET["user_id"], $_GET["booking_id"]);

      if (empty($info)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($info);
      }
    } 
  } else if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (isset($_POST["deleteFlightBooking"])) {
      if (!isset($_POST["booking_id"]) || !isset($_POST["user_id"])) {
        http_response_code(400);
        exit;
      }
      
      $booking = new FlightBooking($conn);
      $errors = [];
      $booking->deleteBooking($_POST["user_id"], $_POST["booking_id"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        http_response_code(200);
        exit;
      }
    } else if (isset($_POST["deleteHotelBooking"])) {
      if (!isset($_POST["booking_id"]) || !isset($_POST["user_id"])) {
        http_response_code(400);
        exit;
      }
      
      $booking = new HotelBooking($conn);
      $errors = [];
      $booking->deleteBooking($_POST["user_id"], $_POST["booking_id"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        http_response_code(200);
        exit;
      }
    }
  } else {
    http_response_code(400);
    exit;
  }
?>