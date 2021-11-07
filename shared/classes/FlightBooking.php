<?php
include("FlightPassenger.php");
include("FlightIteration.php");

class FlightBooking {
  public $id;
  public $user_id;
  public $status;
  public $total_cost;
  public $conn;
  public $date_booked;
  public $iterations = [];
  public $passengers = [];

  public function __construct($conn) {
    $this->setConn($conn);
  }

  public function setConn($conn) {
    $this->conn = $conn;
  }

  public function setID($id) {
    $this->id = intval($id);
  }

  public function addBookingInfo($user_id, $total_cost, &$errors) {
    try {
      //Check info
      if ($total_cost == "" || !filter_var($total_cost, FILTER_SANITIZE_STRING)) {
        $errors["total_cost"] = "Total cost is not valid.";
        return;
      }

      if ($user_id == "") {
        $errors["user_id"] = "User ID is not valid.";
        return;
      }

      $query = "INSERT INTO flight_bookings(user_id, total_cost) VALUES (?, ?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("ss", $user_id, $total_cost);
      $stmt->execute();
      if ($stmt->affected_rows == 1) {
          return $stmt->insert_id;
      } else {
          $errors['execute_err'] = "Server error.";
      } 
    } catch (Exception $e) {
      $errors['execute_err'] = "Server error.";
      return;
    }
  }

  public function addIterations($iterations, &$errors) {
    $iteration = new FlightIteration($this->conn, $this->id);
    $iteration->addIterations($iterations, $errors);
  }

  public function addPassengers($passengers, &$errors) {
    $passenger = new FlightPassenger($this->conn, $this->id);
    $passenger->addPassengers($passengers, $errors);
  }
}