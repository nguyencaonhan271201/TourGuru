<?php
  session_start();
  require_once ("../db.php");
  include('../../shared/classes/User.php');

  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["getProfileInfo"])) {
      $user = new User($conn);
      if (!isset($_GET["id"])) {
        http_response_code(400);
        exit;
      }

      $id = $_GET["id"];
      
      $info = $user->getProfileInfo($id);
      if (empty($info)) {
        http_response_code(400);
        exit;
      } else {
        $info['display-name'] = $info['display_name'];
        unset($info['display_name']);
        echo json_encode($info);
      }
    }
  } else if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (!isset($POST["id"]) || !isset($_POST["displayName"])) {
      http_response_code(400);
      exit;
    }

    //Get param
    $id = $_POST["id"];
    $displayName = $_POST["displayName"];
    if (isset($_FILES["image"])) {
      $image = $_FILES['image'];
    } else {
      $image = null;
    }
    
    $errors = [];

    $user = new User($conn);

    $user->editProfile($id, $displayName, $image, $errors); 

    if (isset($errors["server_error"])) {
      http_response_code(400);
      exit;
    }
    
    $returnObject = [];
    $returnObject['resultCode'] = empty($errors) ? 0 : 1;
    $returnObject['error'] = $errors;
    echo json_encode($returnObject);
  } else {
    http_response_code(400);
    exit;
  }
?>