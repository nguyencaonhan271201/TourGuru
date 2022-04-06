<?php
  session_start();
  require_once("../../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (!isset($_POST["business_name"]) || !isset($_POST["qID"]) || !isset($_POST["text"])) {
    http_response_code(400);
    exit;
  } else {
    //Having all the params
    $business = $_POST['business_name'];
    $questionID = intval($_POST['qID']);
    $content = $_POST["text"];

    //Get the business id
    $query = "SELECT business_id FROM businesses WHERE business_name = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $business);
    $stmt->execute();
    $results = $stmt->get_result();
    $businesses = $results->fetch_all(MYSQLI_ASSOC);
    $businessID = 0;

    if (count($businesses) == 0) {
      http_response_code(403);
      exit;
    } else {
      $businessID = $businesses[0]["business_id"];
    }

    //Insert to database
    $query = "INSERT INTO guest_business_communications(business_id, reply_of, content) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iis", $businessID, $questionID, $content);
    $stmt->execute();
    
    if ($stmt->affected_rows == 1) {
      http_response_code(200);
      exit;
    } else {
      http_response_code(403);
      exit;
    }
  }
?>