<?php
  session_start();
  require_once("../../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_POST["business_name"]) && isset($_POST["userID"]) && isset($_POST["text"])) {
    //Having all the params
    $business = $_POST['business_name'];
    $userID = $_POST['userID'];
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
    $query = "INSERT INTO guest_business_communications(business_id, user_id, content) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iss", $businessID, $userID, $content);
    $stmt->execute();
    
    if ($stmt->affected_rows == 1) {
      http_response_code(200);
      exit;
    } else {
      http_response_code(403);
      exit;
    }
  } else if (isset($_GET["offset"]) && isset($_GET["business_name"])) {
      //Having all the params
      $business = $_GET['business_name'];
      $offset = $_GET['offset'];
  
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
  
      $offset *= 10;
      //Get the business id
      $query = "SELECT gb.*,
      (SELECT mail FROM users u WHERE u.user_id = gb.user_id) AS email,
      (SELECT display_name FROM users u WHERE u.user_id = gb.user_id) AS displayName,
      (SELECT image FROM users u WHERE u.user_id = gb.user_id) AS userIMG
      FROM guest_business_communications gb WHERE business_id = ? AND reply_of IS NULL ORDER BY created DESC LIMIT ?";
      $stmt = $conn->prepare($query);
      $stmt->bind_param("ii", $businessID, $offset);
      $stmt->execute();
      $results = $stmt->get_result();
      $questions = $results->fetch_all(MYSQLI_ASSOC);
  
      if (count($questions) >= ($offset - 10)) {
        $questions = array_slice($questions, $offset - 10, 10);
      } else {
        $questions = [];
      }
      
      $returnArray = [];
      foreach ($questions as $question) {
        $pushObject = new stdClass();
        $pushObject->questionID = $question["comm_id"];
        $pushObject->userName = is_null($question["displayName"])? $question["email"] : $question["displayName"];
        $pushObject->time = $question["created"];
        $pushObject->userID = $question["user_id"];
        $pushObject->text = $question["content"];
        $pushObject->userIMG = $question["userIMG"];
  
        //Get reply
        $query = "SELECT gb.*,
        (SELECT business_code FROM businesses b WHERE b.business_id = gb.business_id) AS businessCode,
        (SELECT business_name FROM businesses b WHERE b.business_id = gb.business_id) AS businessName,
        (SELECT image FROM businesses b WHERE b.business_id = gb.business_id) AS businessIMG,
        (SELECT business_id FROM businesses b WHERE b.business_id = gb.business_id) AS business_id,
        (SELECT biz_user_id FROM businesses b WHERE b.business_id = gb.business_id) AS biz_user_id
        FROM guest_business_communications gb WHERE reply_of = ? ORDER BY created DESC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $question["comm_id"]);
        $stmt->execute();
        $results = $stmt->get_result();
        $replies = $results->fetch_all(MYSQLI_ASSOC);
        
        $repliesArray = [];
        foreach ($replies as $reply) {
          $pushReply = new stdClass();
          $pushReply->answerID = $reply["comm_id"];
          $pushReply->userName = is_null($reply["businessName"])? $reply["businessCode"] : $reply["businessName"];
          $pushReply->time = $reply["created"];
          $pushReply->userID = $reply["business_id"];
          $pushReply->text = $reply["content"];
          $pushReply->businessIMG = $reply["businessIMG"];
          $pushReply->business_id = $reply["business_id"];
          $pushReply->biz_user_id = $reply["biz_user_id"];
  
          array_push($repliesArray, $pushReply);
        }
        $pushObject->answer = $repliesArray;
  
        array_push($returnArray, $pushObject);
      }
  
      echo json_encode($returnArray);
      exit;
  } else {
    http_response_code(400);
    exit;
  }
?>