<?php
require_once("../../../shared/classes/Database.php");

$db = Database::getInstance();
$conn = $db->getConnection();

if (isset($_GET['business_id'])) {
    $offset = $_GET['period'] ? isset($_GET['period']) : 'W';
    $business_code = $GET['business_id'];

    // $period = 'W';
    // $business_id = 3;

    echo json_encode(getBookingInfo($business_id, $period, $conn));
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
