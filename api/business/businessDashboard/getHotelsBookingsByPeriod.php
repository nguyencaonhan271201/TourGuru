<?php
require_once("../../../shared/classes/Database.php");

$db = Database::getInstance();
$conn = $db->getConnection();

if (isset($_GET['business_id'])) {
    $period = isset($_GET['period']) ? $_GET['period'] : 'W';
    $business_code = $_GET['business_id'];

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
        FROM hotel_bookings
        WHERE hotel_id IN
            (SELECT h.hotel_id 
            FROM hotels h 
                JOIN businesses b 
                ON h.name = b.business_name 
            WHERE b.business_type=1 AND b.business_id = ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $business_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    include "../../../shared/classes/getInfoByPeriod.php";
    $info = new getInfoByPeriod();
    return $info->executeReturnObjects($result, $period);
}
