<?php
  session_start();
  require_once ("../db.php");
  include('../../shared/classes/User.php');

  if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    //Sign up with Provider (Google)
    if (isset($_POST["googleSignUp"])) {
      $user = new User($conn);

      if (!isset($_POST["id"]) || !isset($_POST["email"]) || !isset($_POST["displayName"]) || !isset($_POST["image"])) {
        http_response_code(400);
        exit;
      }
      
      //Get parameters
      $id = $_POST["id"];
      $email = $_POST["email"];
      $displayName = $_POST["displayName"];
      $image = $_POST["image"];
      
      //Array of error
      $errors = [];

      $user->providerSignUp($id, $email, $displayName, $image, $errors);

      if (count($errors) > 0) {
        http_response_code(400);
        exit;
      } else {
        http_response_code(200);
        exit;
      }
    }

    //Sign up with local
    if (isset($_POST["localSignUp"])) {
      $user = new User($conn);

      if (!isset($_POST["id"]) || !isset($_POST["email"]) || !isset($_POST["password"])) {
        http_response_code(400);
        exit;
      }

      //Get parameters
      $id = $_POST["id"]? $_POST["id"] : null;
      $email = $_POST["email"]? $_POST["email"] : null;
      $password = $_POST["password"]? $_POST["password"] : null;

      //Array of error
      $errors = [];
      if ($id == null || $password == null || $email == null) {
        http_response_code(400);
        exit;
      }

      $user->localSignUp($id, $email, $password, $errors);

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