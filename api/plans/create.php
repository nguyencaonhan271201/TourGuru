<?php
  session_start();
  //require_once ("../db.php");
  include('../../shared/classes/Plan.php');
  require_once("../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["getFlightBookings"])) {
      $plan = new Plan($conn);
      if (!isset($_GET["id"])) {
        http_response_code(400);
        exit;
      }

      $id = $_GET["id"];
      $errors = [];
      $bookings = $plan->getFlightBookings($id, $errors);

      if (!empty($errors)) {
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
      $errors = [];
      $bookings = $plan->getHotelBookings($id, $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($bookings);
      }
    } 
  } else if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (isset($_POST["planInfo"])) {
      if (!isset($_POST["data"]) || !isset($_POST["colabs"]) || !isset($_POST["locations"])) {
        http_response_code(400);
        exit;
      }
      
      $data = json_decode($_POST["data"], true);
      $colabs = json_decode($_POST["colabs"], true);
      $locations = json_decode($_POST["locations"], true);
      $plan = new Plan($conn);
      $errors = [];
      $inserted_id = $plan->addPlanInfo($data, $colabs, $locations, $errors);

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
    } else if (isset($_POST["searchColabs"])) {
      if (!isset($_POST["query"])) {
        http_response_code(400);
        exit;
      }
      $search = $_POST['query'];
      $search = "%{$search}%";
      $query = "SELECT * FROM users u WHERE
      u.display_name LIKE ? OR u.mail LIKE ?"; 
      $stmt = $conn->prepare($query);

      $stmt->bind_param("ss", $search, $search);


      $stmt->execute();
      $results = $stmt->get_result();
      $results = $results->fetch_all(MYSQLI_ASSOC);

      //Sort the result by similarity
      usort($results, function ($a, $b) use ($query) {
          similar_text($_POST['query'], $a['display_name'], $percentA);
          similar_text($_POST['query'], $b['display_name'], $percentB);

          return $percentA === $percentB ? 0 : ($percentA > $percentB ? -1 : 1);
      });

      echo json_encode($results);
      http_response_code(200);
      exit;
    }
  } else {
    http_response_code(400);
    exit;
  }
?>