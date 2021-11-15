<?php 
  $DB_HOST = "localhost";
  $DB_USER = "id17877771_tourguruadmin";
  $DB_PASSWORD = "TestTourGuru@123";
  $DB_NAME = "id17877771_tourguru";
  $DB_PORT = 3306;

  $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME);
  mysqli_set_charset($conn, 'utf8mb4');
?>