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
            return 1;
        }
        else return 0;
    }

    public function addVisited($userID, $geoID, $long, $lat, $region, $title){
        $sql = "INSERT INTO visited_locations(user_id, location_id, longitude, latitude, region, location_title) VALUES(?,?,?,?,?,?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssddss", $userID, $geoID, $long, $lat, $region, $title);
        $stmt->execute();
        if($stmt->affected_rows == 1){
            return 0;
        } else return 1;
    }

    public function removeVisited($userID, $geoID){
        $sql = "DELETE FROM visited_locations(user_id, location_id) VALUES(?,?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $userID, $geoID);
        $stmt->execute();
        if($stmt->affected_rows == 1){
            return 2; //xoa thanh cong
        } else return 1; //xoa khong thanh cong
    }

}
?>