<?php
  session_start();
  //require_once ("../db.php");
  include('../../shared/classes/Plan.php');
  require_once("../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

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
      $planGeneralInfo = $plan->getPlanGeneral($_GET["user_id"], $_GET["plan_id"], isset($_GET["is_viewer"]));

      if (empty($planGeneralInfo)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($planGeneralInfo);
      }
    } else if (isset($_GET["getPlanColabs"])) {
      if (!isset($_GET["user_id"]) || !isset($_GET["plan_id"])) {
        http_response_code(400);
        exit;
      }

      $plan = new Plan($conn);
      $planColabs = $plan->getPlanColabs($_GET["user_id"], $_GET["plan_id"], isset($_GET["is_viewer"]));

      if (empty($planColabs)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($planColabs);
      }
    }  else if (isset($_GET["getPlanLocations"])) {
      if (!isset($_GET["user_id"]) || !isset($_GET["plan_id"])) {
        http_response_code(400);
        exit;
      }

      $plan = new Plan($conn);
      $planLocations = $plan->getPlanLocations($_GET["user_id"], $_GET["plan_id"], isset($_GET["is_viewer"]));

      echo json_encode($planLocations);
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
    } else if (isset($_GET["checkPlanViewPermission"])) {
      if (!isset($_GET["plan_id"]) || !isset($_GET["user_id"])) {
        http_response_code(400);
        exit;
      }

      $plan = new Plan($conn);
      $errors = [];
      $rightToView = $plan->checkPlanViewPermission($_GET["plan_id"], $_GET["user_id"], $errors);

      if ($rightToView[0]) {
        echo $rightToView[1] ? json_encode(1) : json_encode(0);
        http_response_code(200);
        exit();
      } else {
        if ($rightToView[1]) {
          echo 1;
          http_response_code(200);
          exit();
        } else {
          http_response_code(400);
          exit;
        }
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