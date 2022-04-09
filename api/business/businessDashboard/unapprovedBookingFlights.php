<?php
require_once("../../../shared/classes/Database.php");

$db = Database::getInstance();
$conn = $db->getConnection();

if (isset($_GET['business_id'])) {
    $business_id = $_GET['business_id'];
    //$business_id = 1;

    $result = [];

    array_push($result, 
        getTotalBooking($business_id, $conn),
        getNewBooking($business_id, $conn),
        getRevenue($business_id, $conn),
    );

    echo json_encode($result);
} else echo json_encode(false); //chua set du lieu 

function getTotalBooking($business_id, $conn)
{
    $sql =
        "SELECT COUNT(*) as 'totalBooking'
        FROM flight_bookings
        WHERE id IN
        (SELECT fi.booking_id FROM flight_bookings_iterations fi JOIN businesses b ON fi.flight_number LIKE CONCAT('%', b.business_code, '%') WHERE b.business_type=0 AND b.business_id = ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$business_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    return $result;
}

function getNewBooking($business_id, $conn)
{
    $sql =
        "SELECT COUNT(*) as 'newBooking'
        FROM flight_bookings
        WHERE status = 0
        and id IN
        (SELECT fi.booking_id FROM flight_bookings_iterations fi JOIN businesses b ON fi.flight_number LIKE CONCAT('%', b.business_code, '%') WHERE b.business_type=0 AND b.business_id = ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$business_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    return $result;
}

function getRevenue($business_id, $conn)
{
    $sql =
        "SELECT SUM(total_cost) as 'revenue'
        FROM flight_bookings
        WHERE status = 1
        and id IN
        (SELECT fi.booking_id FROM flight_bookings_iterations fi JOIN businesses b ON fi.flight_number LIKE CONCAT('%', b.business_code, '%') WHERE b.business_type=0 AND b.business_id = ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$business_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    return $result;
}
