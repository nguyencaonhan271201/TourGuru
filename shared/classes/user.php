<?php
class User{
    public $username;
    public $ID;
    public $dashboard;
    public $mail;
    public $role;
    public $conn;

    public function __construct(){

    }
    public function setConn($conn) {
        $this->conn = $conn;
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
    
}
?>