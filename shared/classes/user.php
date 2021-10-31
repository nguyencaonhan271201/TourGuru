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
    
}
?>