<?php
  session_start();
  require_once ("../db.php");
  include('../../shared/classes/Plan.php');

  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["getPlans"])) {
      if (!isset($_GET["id"])) {
        http_response_code(400);
        exit;
      }

      $plan = new Plan($conn);
      $errors = [];
      $plans = $plan->getPlans($_GET["id"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($plans);
      }
    } else if (isset($_GET["getPlanGeneral"])) {
      if (!isset($_GET["user_id"]) || !isset($_GET["plan_id"])) {
        http_response_code(400);
        exit;
      }

      $plan = new Plan($conn);
      $planGeneralInfo = $plan->getPlanGeneral($_GET["user_id"], $_GET["plan_id"]);

      if (empty($planGeneralInfo)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($planGeneralInfo);
      }
    } else if (isset($_GET["getPlanDetails"])) {
      if (!isset($_GET["plan_id"])) {
        http_response_code(400);
        exit;
      }

      $plan = new Plan($conn);
      $errors = [];
      $planDetails = $plan->getPlanDetails($_GET["plan_id"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($planDetails);
      }
    }
  } else if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (isset($_POST["deletePlan"])) {
      if (!isset($_POST["planID"]) || !isset($_POST["uid"])) {
        http_response_code(400);
        exit;
      }

      $plan = new Plan($conn);
      $errors = [];

      $plan->deletePlan($_POST["planID"], $_POST["uid"], $errors);

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