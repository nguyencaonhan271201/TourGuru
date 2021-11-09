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

        public function getPeriodRange($period){
            $today = new DateTime(date('Y-m-d'));
            // $day = new DateTime(($today->format('Y') - 1).'-'.$today->format('m').'-1');
            // echo($today->format('Y-m-d')); echo("\r\n");
            // echo($day->format('Y-m-d')); echo("\r\n");
            switch ($period) {
               case 'Y':
                    $day = new DateTime(($today->format('Y') - 1).'-'.$today->format('m').'-1');
                   break;
                case 'Q':
                    return 0;
                case 'M':
                    return 0;
                case 'W':
                    return 0;
   
               default:
                   return false; //Param period have problems
            }
            $interval = $day->diff($today)->format("%r%a");
            echo($interval);
            //return $today->diff($day); //Tổng số ngày tính từ $day -> today;
        }

        public function getTotalBooking($period = 'D'){
            //period ('Y'/'Q'/'M'/'W')
            $sql = 
            "SELECT count(*) 
            FROM hotel_bookings 
            WHERE date_booked > cast(CURRENT_DATE - ? as date)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i");


        }

        public function getBookingInfo($offset){
            $offset *= 10;
            $sql = 
            "SELECT id as bookingNo, hotel_name as hotelName, hotel_id, date_start as 'from', date_end as 'to', user_id as userID, date_booked as timeBooked 
            FROM hotel_bookings 
            ORDER BY date_booked DESC
            LIMIT ?  ";

            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $offset);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            return array_slice($result, -10);//get last 10 elements of result ()
        }
    }
?>