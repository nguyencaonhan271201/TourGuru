<?php
    class flights{
        public $bookingID;
        public $userID;
        public $conn;

        public function __construct($conn, $bookingID = null)
        {
            $this->conn = $conn;
            $this->bookingID = $bookingID;
        }

        public function getTotalBooking($period = 'W'){
            //period ('Y'/'Q'/'M'/'W')
            $query = "SELECT date_booked FROM flight_bookings";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            include "getInfoByPeriod.php";
            $info = new getInfoByPeriod();
            return $info->executeReturnObjects($result, $period);
        }

        public function getBookingInfo($offset){
            $offset *= 10;
            $sql = 
            "SELECT booking_id as bookingNo, origin as 'from', destination as 'to', user_id as userID, departure as dep, date_booked as timeBooked 
            FROM flight_bookings_iterations 
            JOIN flight_bookings 
            ON flight_bookings_iterations.booking_id = flight_bookings.id
            ORDER BY date_booked DESC
            LIMIT ?";

            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $offset);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            if (sizeof($result) < $offset - 9) return [];
            return array_slice($result, -(sizeof($result)-($offset - 10)));//keep exp last elements
        }

        public function deleteBooking($userID){
            $query = 
            "DELETE FROM flight_bookings 
            WHERE id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("is", $this->bookingID, $userID);
            $stmt->execute();
            if($stmt->affected_rows == 1){
                return 0; //xoa thanh cong
            } else return 1; //xoa khong thanh cong
        }
    }
?>