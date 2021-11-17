<?php
  session_start();
  //require_once ("../db.php");
  include('../../shared/classes/User.php');
  require_once("../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["getVisitedLocations"])) {
      $user = new User($conn);
      if (!isset($_GET["id"])) {
        http_response_code(400);
        exit;
      }

      $id = $_GET["id"];
      $errors = [];
      $visited = $user->getVisitedLocations($id, $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($visited);
      }
    }
  } else {
    http_response_code(400);
    exit;
  }
?>