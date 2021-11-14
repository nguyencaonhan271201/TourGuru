<?php
  session_start();
  require_once("../db.php");
  include("../email/sendEmail.php");
  include('../../shared/classes/HotelBooking.php');

  if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (isset($_POST["bookingInfo"])) {
      if (!isset($_POST["data"])) {
        http_response_code(400);
        exit;
      }
      
      $data = json_decode($_POST["data"], true);
      $booking = new HotelBooking($conn);

      $errors = [];

      $booking->addBookingInfo($data, $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        http_response_code(200);
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