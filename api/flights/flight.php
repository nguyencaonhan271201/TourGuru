<?php

  session_start();
  require_once("../db.php");
  include("../email/sendEmail.php");
  include('../../shared/classes/FlightBooking.php');

  if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (isset($_POST["bookingInfo"])) {
      if (!isset($_POST["user_id"]) || !isset($_POST["total_cost"])) {
        http_response_code(400);
        exit;
      }
      
      $booking = new FlightBooking($conn);
      $user_id = $_POST["user_id"];
      $total_cost = $_POST["total_cost"];

      $errors = [];

      $inserted_id = $booking->addBookingInfo($user_id, $total_cost, $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo $inserted_id;
      }
    } else if (isset($_POST["bookingIterations"])) {
      if (!isset($_POST["booking_id"]) || !isset($_POST["data"])) {
        http_response_code(400);
        exit;
      }

      $data = json_decode($_POST["data"], true);
      if (count($data) < 1 || count($data) > 2) {
        //Bad param
        http_response_code(400);
        exit;
      }

      $booking = new FlightBooking($conn);
      $booking->setID($_POST["booking_id"]);

      $errors = [];

      $booking->addIterations($data, $errors);

      if (empty($errors)) {
        http_response_code(200);
        exit;
      } else {
        http_response_code(400);
        exit;
      }

    } else if (isset($_POST["bookingCustomers"])) {
      if (!isset($_POST["booking_id"]) || !isset($_POST["data"])) {
        http_response_code(400);
        exit;
      }

      $data = json_decode($_POST["data"], true);
      if (count($data) < 1 || count($data) > 6) {
        //Bad param
        http_response_code(400);
        exit;
      }

      $booking = new FlightBooking($conn);
      $booking->setID($_POST["booking_id"]);

      $errors = [];

      $booking->addPassengers($data, $errors);
      var_dump($errors);
      exit;

      if (empty($errors)) {
        http_response_code(200);
        exit;
      } else {
        http_response_code(400);
        exit;
      }
    } else if (isset($_POST["sendEmail"])) {
      if (!isset($_POST["to"]) || !isset($_POST["subject"])
      || !isset($_POST["content"])) {
        http_response_code(400);
        exit;
      }

      $to = $_POST["to"];
      if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        //Not valid email to send
        http_response_code(400);
        exit;
      }
      $subject = $_POST["subject"];
      $content = $_POST["content"];
      $error = false;

      sendEmail($to, "", $subject, $content, $error);

      if ($error) {
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