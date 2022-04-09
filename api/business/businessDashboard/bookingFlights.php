<?php
require_once("../../../shared/classes/Database.php");

$db = Database::getInstance();
$conn = $db->getConnection();

if (isset($_GET['business_code'])) {
    $offset = isset($_GET['offset']) ? $_GET['offset'] : 1;
    $business_code = $_GET['business_code'];

    //Get the business id
    $query = "SELECT business_id FROM businesses WHERE biz_user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $business_code);
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

    echo json_encode(getBookingInfo($offset, $businessID, $conn));
} else echo json_encode(false); //chua set du lieu 


function getBookingInfo($offset, $business_id, $conn)
{
    $offset *= 10;

    $sql =
        "SELECT fi.* FROM flight_bookings_iterations fi JOIN businesses b ON fi.flight_number LIKE CONCAT('%', b.business_code, '%') WHERE b.business_type=0 AND b.business_id = ?
        LIMIT ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii",$business_id, $offset);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    if (count($result) >= ($offset - 10)) {
$result = array_slice($result, $offset - 10, 10);
    } else {
        $result = [];
    }

    $bookingIDs = [];

    foreach($result as $item) {        
        if (!in_array($item["booking_id"], $bookingIDs)) {
            array_push($bookingIDs, $item["booking_id"]);
        }
    }

    $return = [];

    foreach($bookingIDs as $id) {
        $sql = "SELECT *,
        (SELECT COUNT(*) FROM flight_bookings_customers fbc WHERE fbc.booking_id = fb.id) AS number_of_pax
        FROM flight_bookings fb
        WHERE fb.id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $results = $stmt->get_result();
        $flight_info = $results->fetch_assoc();

        $pushObject = new stdClass();
        $pushObject->bookingID = $flight_info["id"];
        $pushObject->noOfPax = $flight_info["number_of_pax"];

        $iterationArray = [];

        foreach($result as $item) {        
            if ($item["booking_id"] === $flight_info["id"])
                array_push($iterationArray, $item);
        }
        $pushObject->iterations = $iterationArray;
        $pushObject->status = $flight_info["status"];
        $pushObject->userID = $flight_info["user_id"];
        $pushObject->totalFare = $flight_info["total_cost"];

        array_push($return, $pushObject);
    }

    return $return;
}
?>
