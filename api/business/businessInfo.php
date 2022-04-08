<?php
  session_start();
  require_once("../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_POST["biz_user_id"])) {
    $firebaseID = $_POST["biz_user_id"];

    $sql = "SELECT business_id, business_name, business_code, mail, image, business_type
    FROM businesses WHERE biz_user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $firebaseID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if($result->num_rows == 1){
      echo json_encode($result->fetch_assoc());
      exit;
    } else {
      http_response_code(400);
      exit;
    }
  } else {
    http_response_code(403);
    exit;
  }