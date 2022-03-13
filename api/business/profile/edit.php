<?php
  session_start();
  //require_once ("../db.php");
  include('../../../shared/classes/Business.php');
  require_once("../../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["getProfileInfo"])) {
      $business = new Business($conn);
      if (!isset($_GET["id"])) {
        http_response_code(400);
        exit;
      }

      $id = $_GET["id"];
      
      $info = $business->getProfileInfo($id);
      if (empty($info)) {
        http_response_code(400);
        exit;
      } else {
        $info['display-name'] = $info['business_name'];
        unset($info['business_name']);
        echo json_encode($info);
      }
    } else {
      if (isset($_GET["getHeaderInfo"])) {
        $business = new Business($conn);
        if (!isset($_GET["id"])) {
          http_response_code(400);
          exit;
        }
  
        $id = $_GET["id"];
        
        $info = $business->getHeaderInfo($id);
        $info['isAdmin'] = false;
        $info['isBusiness'] = true;
        $info['businessName'] = $info['business_name'];
        $info['businessCode'] = $info['business_code'];
        unset($info['business_name']);
        unset($info['business_code']);
        if (empty($info)) {
          http_response_code(400);
          exit;
        } else {
          echo json_encode($info);
        }
      }
    }
  } else if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (!isset($_POST["id"]) || !isset($_POST["displayName"]) || !isset($_POST["businessCode"])) {
      http_response_code(400);
      exit;
    }

    //Get param
    $id = $_POST["id"];
    $displayName = $_POST["displayName"];
    $businessCode = $_POST["businessCode"];
    if (isset($_FILES["image"])) {
      $image = $_FILES['image'];
    } else {
      $image = null;
    }

    
    $errors = [];

    $business = new Business($conn);

    $business->editProfile($id, $displayName, $businessCode, $image, $errors); 

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