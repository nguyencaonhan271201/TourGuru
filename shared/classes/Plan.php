<?php
include 'PlanDetail.php';

class Plan {
  public $conn;
  public $id;
  public $user_id;
  public $plan_title;
  public $description;
  public $flight_id;
  public $hotel_id;
  public $from_date;
  public $to_date;
  public $date_created;
  public $details = [];

  public function __construct($conn) {
    $this->setConn($conn);
  }

  public function setConn($conn) {
    $this->conn = $conn;
  }

  public function getFlightBookings($uid) {
    try {
      $query = "SELECT f1.*, (SELECT f.total_cost FROM flight_bookings f WHERE f.id = f1.booking_id) AS total_price, 
      (SELECT COUNT(*) FROM flight_bookings_customers f2 WHERE f2.booking_id = f1.booking_id) AS number_of_pax,
      (SELECT f.date_booked FROM flight_bookings f WHERE f.id = f1.booking_id) AS date_booked 
      FROM flight_bookings_iterations f1 
      WHERE booking_id IN (SELECT id FROM flight_bookings WHERE status = 1 AND user_id = ?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $uid);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getHotelBookings($uid) {
    try {
      $query = "SELECT * FROM hotel_bookings WHERE user_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $uid);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function addPlanInfo($data, &$errors) {
    try {
      //List of fields
      $fields = ["user_id", "plan_title", "description", "from_date"];

      foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] == "") {
          $errors[$field] = "Missing data.";
          return;
        }
      }

      $query = "INSERT INTO plans(user_id, plan_title, description, flight_id, hotel_id, from_date,
      to_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
      $stmt = $this->conn->prepare($query);

      $valueInsert = [];

      foreach ($data as $key => $value) {
        array_push($valueInsert, htmlspecialchars($value));
      }

      $stmt->bind_param("sssssss", ...$valueInsert);

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

  public function addPlanDetails($details, &$errors) {
    $detail = new PlanDetail($this->conn);
    $detail->addPlanDetails($details, $errors);
  }

  public function getPlans($uid) {
    try {
      $query = "SELECT * FROM plans WHERE user_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $uid);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getPlanGeneral($uid, $plan_id) {
    try {
      $query = "SELECT * FROM plans WHERE user_id = ? AND id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("si", $uid, $plan_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_assoc();
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getPlanDetails($plan_id, &$errors) {
    $detail = new PlanDetail($this->conn);
    return $detail->getPlanDetails($plan_id, $errors);
  }

  public function deletePlan($plan_id, $uid, &$errors) {
    $sql = "DELETE FROM plans WHERE user_id = ? AND id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("si", $uid, $plan_id);
    $stmt->execute();
    if ($stmt->affected_rows != 1){
      $errors["server_err"] = "Error occurred!!!";
    }
  }
}