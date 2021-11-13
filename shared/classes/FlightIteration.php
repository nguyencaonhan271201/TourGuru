<?php
class FlightIteration {
  public $booking_id;
  public $iterations = [];
  public $conn;

  public function __construct($conn, $id) {
    $this->setConn($conn);
    $this->booking_id = $id;
  }

  public function setConn($conn) {
    $this->conn = $conn;
  }

  public function addIterations($iterations, &$errors) {
    try {
      foreach ($iterations as $iteration) {
        $query = "INSERT INTO flight_bookings_iterations(booking_id, origin_code, dest_code, origin, destination, departure, arrival,
        date, class, aircraft, airline, flight_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);

        $valueInsert = [];

        foreach ($iteration as $key => $value) {
          array_push($valueInsert, htmlspecialchars($value));
        }

        $stmt->bind_param("isssssssssss", ...$valueInsert);

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
}