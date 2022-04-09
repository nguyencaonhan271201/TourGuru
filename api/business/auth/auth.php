<?php
  session_start();
  //require_once ("../db.php");
  include('../../../shared/classes/Business.php');
  require_once("../../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    //Sign up with local
    if (isset($_POST["localSignUp"])) {
      $business = new Business($conn);

      if (!isset($_POST["id"]) || !isset($_POST["email"]) || !isset($_POST["password"])
      || !isset($_POST["business"]) || !isset($_POST["type"])) {
        http_response_code(400);
        exit;
      }

      //Get parameters
      $id = $_POST["id"]? $_POST["id"] : null;
      $email = $_POST["email"]? $_POST["email"] : null;
      $password = $_POST["password"]? $_POST["password"] : null;
      $businessName = $_POST["business"]? $_POST["business"] : null;
      $businessType = $_POST["type"] != null? $_POST["type"] : null;

      var_dump($id);
      var_dump($email);
      var_dump($password);
      var_dump($businessName);
      var_dump($_POST["type"]);
      var_dump($businessType);

      //Array of error
      $errors = [];
      if ($id == null || $password == null || $email == null || $businessName == null || $businessType == null) {
        http_response_code(400);
        exit;
      }

      $business->localSignUp($id, $email, $password, $businessName, $businessType, $errors);

      if (count($errors) > 0) {
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