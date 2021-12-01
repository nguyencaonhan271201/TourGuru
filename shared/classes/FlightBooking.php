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

  public function getFlightBookingInfo($user_id, $booking_id) {
    try {
      $query = "SELECT f1.*, (SELECT f.total_cost FROM flight_bookings f WHERE f.id = f1.booking_id) AS total_price, 
      (SELECT COUNT(*) FROM flight_bookings_customers f2 WHERE f2.booking_id = f1.booking_id) AS number_of_pax,
      (SELECT f.date_booked FROM flight_bookings f WHERE f.id = f1.booking_id) AS date_booked FROM flight_bookings_iterations f1 
      WHERE booking_id IN (SELECT id FROM flight_bookings WHERE status = 1 AND id = ? AND user_id = ?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("is", $booking_id, $user_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getFlightBookingPax($user_id, $booking_id) {
    $passenger = new FlightPassenger($this->conn, $booking_id);
    return $passenger->getPassengers($user_id);
  }

  public function getFlightBookingInfoAdmin($user_id, $booking_id) {
    try {
      $query = "SELECT * FROM users WHERE user_id = ? AND role = 0";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $user_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

      if (count($result) != 1) {
        return;
      }

      $query = "SELECT f1.*, (SELECT f.total_cost FROM flight_bookings f WHERE f.id = f1.booking_id) AS total_price, 
      (SELECT COUNT(*) FROM flight_bookings_customers f2 WHERE f2.booking_id = f1.booking_id) AS number_of_pax,
      (SELECT f.date_booked FROM flight_bookings f WHERE f.id = f1.booking_id) AS date_booked FROM flight_bookings_iterations f1 
      WHERE booking_id IN (SELECT id FROM flight_bookings WHERE status = 1 AND id = ?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $booking_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getFlightBookingPaxAdmin($user_id, $booking_id) {
    $query = "SELECT * FROM users WHERE user_id = ? AND role = 0";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    if (count($result) != 1) {
      return;
    }

    $passenger = new FlightPassenger($this->conn, $booking_id);
    return $passenger->getPassengersAdmin();
  }

  public function deleteBooking($uid, $booking_id, &$errors) {
    $sql = "DELETE FROM flight_bookings WHERE user_id = ? AND id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("si", $uid, $booking_id);
    $stmt->execute();
    if ($stmt->affected_rows != 1){
      $errors["server_err"] = "Error occurred!!!";
    }
  }
}