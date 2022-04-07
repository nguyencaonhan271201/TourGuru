<?php
  session_start();
  require_once("../../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_GET["questionID"])) {
    //Get reply
    $query = "SELECT gb.*,
    (SELECT business_code FROM businesses b WHERE b.business_id = gb.business_id) AS businessCode,
    (SELECT business_name FROM businesses b WHERE b.business_id = gb.business_id) AS businessName
    FROM guest_business_communications gb WHERE reply_of = ? ORDER BY created DESC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $_GET["questionID"]);
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

      array_push($repliesArray, $pushReply);
    }

    echo json_encode($repliesArray);
    exit;
  } else {
    http_response_code(400);
    exit;
  }
?>