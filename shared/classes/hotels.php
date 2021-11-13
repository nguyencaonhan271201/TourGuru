<?php
    class hotels{
        public $bookingID;
        public $userID;
        public $status;
        public $conn;

        public function __construct($conn, $bookingID = null)
        {
            $this->conn = $conn;
            $this->bookingID = $bookingID;
        }

        public function getTotalBooking($period = 'W'){
            //period ('Y'/'Q'/'M'/'W')
            $query = "SELECT date_booked FROM hotel_bookings";
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
            "SELECT id as bookingNo, hotel_name as hotelName, hotel_id, date_start as 'from', date_end as 'to', user_id as userID, date_booked as timeBooked 
            FROM hotel_bookings 
            ORDER BY date_booked DESC
            LIMIT ?";

            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $offset);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

            if (count($result) >= ($offset - 10)) {
                return array_slice($result, $offset - 10, 10);
            } else {
                return [];
            }
            //return array_slice($result, -10);//get last 10 elements of result ()
        }

        public function deleteBooking($userID){
            $query = 
            "DELETE FROM hotel_bookings 
            WHERE id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("is", $this->bookingID, $userID);
            $stmt->execute();
            if($stmt->affected_rows == 1){
                return 1;
            } else return 0;
        }
    }
?>