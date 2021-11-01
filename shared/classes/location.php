<?php
class location{
    public $locID;
    public $locTitle;
    public $conn;

    public function  __construct($conn){
        $this->conn = $conn;
    }

    public function checkVisited($userID, $geoID){
        $sql = "SELECT * FROM visited_locations WHERE user_id = ? and location_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $userID, $geoID);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows == 0){
            return 1;//chua den
        }
        else return 0;//da den
    }

    public function addVisited($userID, $geoID){
        $sql = "INSERT INTO visited_locations(user_id, location_id) VALUES(?,?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $userID, $geoID);
        $stmt->execute();
        if($stmt->affected_rows == 1){
            return 0; //add thanh cong
        } else return 1; //add khong thanh cong
    }

}
?>