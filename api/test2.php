<?php
  require_once("./db.php");

  var_dump(executeReturnObjects("W"));

  function executeReturnObjects($period) {
    global $conn;
    date_default_timezone_set('Asia/Ho_Chi_Minh');

    //Get list of regions
    $query = "SELECT DISTINCT(region) FROM visited_locations";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $regions = [];
    foreach ($result as $row) {
      array_push($regions, $row["region"]);
    }

    //Get list of visited locations
    $query = "SELECT * FROM visited_locations";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $returnArray = [];
    foreach ($regions as $region) {
      $pushObject = new stdClass();
      $pushObject->zone = $region;
      $pushObject->sum = 0;
      array_push($returnArray, $pushObject);
    }

    switch ($period) {
      case "Y":
        $startDate = new DateTime("- 1 year");
        break;
      case "Q":
        $startDate = new DateTime("- 3 months");
        break;
      case "M":
        $startDate = new DateTime("- 1 month");
        break;
      case "W":
        $startDate = new DateTime("- 1 week");
        break;
    }
    $startDate->setTime(0, 0, 0);

    $endDate = new DateTime("");
    $endDate->setTime(23, 59, 59);
    
    foreach ($result as $booking) {
      $date = new DateTime($booking["date_created"]);
      $date->modify("+7 hours");
      
      if ($date >= $startDate && $date <= $endDate) {
        for ($i = 0; $i < count($returnArray); $i++) {
          if ($booking["region"] == $returnArray[$i]->zone) {
            $returnArray[$i]->sum += 1;
          }
        }
      }
    }
    return $returnArray;
  }