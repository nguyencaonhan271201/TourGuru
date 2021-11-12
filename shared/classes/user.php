<?php
class User{
    public $username;
    public $ID;
    public $dashboard;
    public $mail;
    public $role;
    public $conn;

    public function __construct($conn = null, $ID = null){
        $this->conn = $conn;
        $this->ID = $ID;
    }

    public function deleteUser($userID){
        $sql = "DELETE FROM users WHERE user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $userID);
        if($stmt->affected_rows == 1){
            http_response_code(200);
            return 1; //add thanh cong
        } else {
            http_response_code(400);
            return 0; //add khong thanh cong
        }
    }
    

    public function getUserForDashboard($offset){
        $offset *= 10;
            $sql = 
            "SELECT user_id as userID, display_name as userName, mail, date_created as timeCreated
            FROM users
            ORDER BY date_created DESC
            LIMIT ?  ";

            //userID,userName, mail, timeCreated

            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $offset);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            var_dump($result);
            if (sizeof($result) < $offset - 9) return [];
            return array_slice($result, -(sizeof($result)-($offset - 10)));//keep exp last elements
    }
}
?>