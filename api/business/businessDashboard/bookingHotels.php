<?php
require_once("../../../shared/classes/Database.php");

$db = Database::getInstance();
$conn = $db->getConnection();

if (isset($_GET['business_id'])) {
    $offset = $_GET['offset'] ? isset($_GET['offset']) : 1;
    $business_code = $GET['business_id'];

    // $offset = 1;
    // $business_id = 3;

    echo json_encode(getBookingInfo($offset, $business_id, $conn));
} else echo json_encode(false); //chua set du lieu 


function getBookingInfo($offset, $business_id, $conn)
{
    $offset *= 10;

    $sql =
        "SELECT * FROM hotel_bookings
        WHERE hotel_id IN
        (SELECT h.hotel_id FROM hotels h JOIN businesses b ON h.name = b.business_name WHERE b.business_type=1 AND b.business_id = ?)
        LIMIT ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii",$business_id, $offset);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    if (count($result) >= ($offset - 10)) {
        return array_slice($result, $offset - 10, 10);
    } else {
        return [];
    }
}
?>
