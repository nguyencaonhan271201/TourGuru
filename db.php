<?php
$host = "localhost";
$user = "root";
$pw = "";
$db = "tourguru";

$conn = new mysqli($host, $user, $pw, $db);
mysqli_set_charset($conn, 'utf8mb4');
?>