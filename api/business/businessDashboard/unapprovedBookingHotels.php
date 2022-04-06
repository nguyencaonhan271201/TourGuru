<?php
require_once("../../../shared/classes/Database.php");

$db = Database::getInstance();
$conn = $db->getConnection();

// if (isset($_GET['business_id'])) {
//     $offset = $_GET['offset'] ? isset($_GET['offset']) : 1;
//     $business_code = $GET['business_id'];
    $business_id = 3;

    echo json_encode(getTotalBooking($business_id, $conn));
// } else echo json_encode(false); //chua set du lieu 


function getTotalBooking($business_id, $conn)
{
    $sql =
        "SELECT COUNT(*) AS 'totalBooking' FROM hotel_bookings
        WHERE approved <> 1 and 
            hotel_id IN
            (SELECT h.hotel_id 
            FROM hotels h 
                JOIN businesses b 
                ON h.name = b.business_name 
            WHERE b.business_type=1 AND b.business_id = ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$business_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    return $result;
}
