<?php
require_once("../../../shared/classes/Database.php");

$db = Database::getInstance();
$conn = $db->getConnection();

if (isset($_GET['business_id'])) {
    $period = isset($_GET['period']) ? $_GET['period'] : 'W';
    $business_id = $_GET['business_id'];

    // $period = 'W';
    // $business_id = 1;

    echo json_encode(getBookingInfo($business_id, $period, $conn));
} else echo json_encode(false); //chua set du lieu 


function getBookingInfo($business_id, $period = 'W', $conn)
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
