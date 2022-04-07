<?php
require_once("../../../shared/classes/Database.php");

$db = Database::getInstance();
$conn = $db->getConnection();

if (isset($_GET['business_code'])) {
    $period = isset($_GET['period']) ? $_GET['period'] : 'W';
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

    echo json_encode(getBookingInfo($businessID, $period, $conn));
} else echo json_encode(false); //chua set du lieu 


function getBookingInfo($business_id, $period, $conn)
{
    $sql =
        "SELECT date_booked
        FROM flight_bookings
        WHERE id IN
            (SELECT fi.booking_id 
            FROM flight_bookings_iterations fi 
                JOIN businesses b 
                ON fi.flight_number LIKE CONCAT('%', b.business_code, '%') 
            WHERE b.business_type=0 AND b.business_id = ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $business_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    include "../../../shared/classes/getInfoByPeriod.php";
    $info = new getInfoByPeriod();
    return $info->executeReturnObjects($result, $period);
}
