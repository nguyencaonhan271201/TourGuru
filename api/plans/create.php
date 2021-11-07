<?php
  session_start();
  require_once ("../db.php");
  include('../../shared/classes/Plan.php');

  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["getFlightBookings"])) {
      $plan = new Plan($conn);
      if (!isset($_GET["id"])) {
        http_response_code(400);
        exit;
      }

      $id = $_GET["id"];
      
      $bookings = $plan->getFlightBookings($id);

      if (empty($bookings)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($bookings);
      }
    } else if (isset($_GET["getHotelBookings"])) {
      $plan = new Plan($conn);
      if (!isset($_GET["id"])) {
        http_response_code(400);
        exit;
      }

      $id = $_GET["id"];
      
      $bookings = $plan->getHotelBookings($id);

      if (empty($bookings)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($bookings);
      }
    } 
  } else if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (isset($_POST["planInfo"])) {
      if (!isset($_POST["data"])) {
        http_response_code(400);
        exit;
      }
      
      $data = json_decode($_POST["data"], true);
      $plan = new Plan($conn);
      $errors = [];
      $inserted_id = $plan->addPlanInfo($data, $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo $inserted_id;
      }
    } else if (isset($_POST["planDetails"])) {
      if (!isset($_POST["data"])) {
        http_response_code(400);
        exit;
      }

      $data = json_decode($_POST["data"], true);
      $plan = new Plan($conn);
      $errors = [];
      $plan->addPlanDetails($data, $errors);

      if (empty($errors)) {
        http_response_code(200);
        exit;
      } else {
        http_response_code(400);
        exit;
      }
    }
  } else {
    http_response_code(400);
    exit;
  }
?>