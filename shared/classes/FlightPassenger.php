<?php
class FlightPassenger {
  public $booking_id;
  public $passengers = [];
  public $conn;

  public function __construct($conn, $id) {
    $this->setConn($conn);
    $this->booking_id = $id;
  }

  public function setConn($conn) {
    $this->conn = $conn;
  }

  public function addPassengers($passengers, &$errors) {
    try {
      foreach ($passengers as $passenger) {
        $query = "INSERT INTO flight_bookings_customers(booking_id, title, display_name, dob, passport) 
        VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);

        $valueInsert = [];

        foreach ($passenger as $key => $value) {
          array_push($valueInsert, htmlspecialchars($value));
        }

        $stmt->bind_param("issss", ...$valueInsert);
        $stmt->execute();

        if ($stmt->affected_rows != 1) {
          $errors['execute_err'] = "Server error.";
          return;
        }
      }
    } catch (Exception $e) {
      $errors['execute_err'] = "Server error.";
      return;
    }
  }

  public function getPassengers($user_id) {
    try {
      $query = "SELECT * FROM flight_bookings_customers WHERE booking_id IN 
      (SELECT id from flight_bookings WHERE id = ? AND user_id = ?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("is", $this->booking_id, $user_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getPassengersAdmin() {
    try {
      $query = "SELECT * FROM flight_bookings_customers WHERE booking_id IN 
      (SELECT id from flight_bookings WHERE id = ?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $this->booking_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }
}