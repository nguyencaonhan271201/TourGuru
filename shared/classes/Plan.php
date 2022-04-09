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

  public function getFlightBookings($uid, &$errors) {
    try {
      $query = "SELECT f1.*, (SELECT f.total_cost FROM flight_bookings f WHERE f.id = f1.booking_id) AS total_price, 
      (SELECT COUNT(*) FROM flight_bookings_customers f2 WHERE f2.booking_id = f1.booking_id) AS number_of_pax,
      (SELECT f.date_booked FROM flight_bookings f WHERE f.id = f1.booking_id) AS date_booked,
      (SELECT f.status FROM flight_bookings f WHERE f.id = f1.booking_id) AS status,
      (SELECT b.business_id FROM businesses b WHERE f1.flight_number LIKE CONCAT('%', b.business_code, '%') AND b.business_type=0) AS business
      FROM flight_bookings_iterations f1 
      WHERE booking_id IN (SELECT id FROM flight_bookings WHERE user_id = ?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $uid);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function getHotelBookings($uid, &$errors) {
    try {
      $query = "SELECT id, user_id, date_start, date_end, number_of_nights, approved AS status, date_booked, total_cost,
      (SELECT name FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_name,
      (SELECT image_url FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_image_url,
      (SELECT address FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_address,
      (SELECT SUM(number_of_room)  FROM hotel_booking_details h2 WHERE h2.booking_id = h1.id) AS number_of_beds,
      (SELECT business_id FROM businesses b JOIN hotels h ON h.name = b.business_name WHERE h.hotel_id = h1.hotel_id) AS business
      FROM hotel_bookings h1 WHERE user_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $uid);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function addPlanInfo($data, $colabs, $locations, $isEdit, &$errors) {
    try {
      //List of fields
      $fields = ["user_id", "plan_title"];

      foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] == "") {
          $errors[$field] = "Missing data.";
          return;
        }
      }

      $query = "INSERT INTO plans(user_id, plan_title, description, flight_id, hotel_id, from_date,
      to_date, mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      $stmt = $this->conn->prepare($query);

      $valueInsert = [];

      foreach ($data as $key => $value) {
        array_push($valueInsert, htmlspecialchars($value));
      }

      $stmt->bind_param("sssssssi", ...$valueInsert);

      $stmt->execute();

      $insert_id = -1;

      if ($stmt->affected_rows == 1) {
        $insert_id = $stmt->insert_id;

        //Add colabs
        foreach($colabs as $colab) {
          $query = "INSERT INTO plan_editors(plan_id, user_id) VALUES (?, ?)";
          $stmt = $this->conn->prepare($query);
          $stmt->bind_param("is", $insert_id, $colab["id"]);
          $stmt->execute();
        }

        foreach($locations as $location) {
          $query = "INSERT INTO plan_locations(plan_id, location_id, location_name, location_image) VALUES (?, ?, ?, ?)";
          $stmt = $this->conn->prepare($query);
          $stmt->bind_param("isss", $insert_id, $location["location_id"], $location["location_name"], $location["location_image"]);
          $stmt->execute();
        }

        if ($isEdit != null) {
          if ($data["mode"] === 1) {
            //Update linked plan
            $query = "UPDATE posts SET plan_id = ? WHERE plan_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ii", $insert_id, $isEdit);
          } else {
            $query = "UPDATE posts SET plan_id = NULL WHERE plan_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $isEdit);
          }
          $stmt->execute();
        }

        return $insert_id;
      } else {
        $errors['execute_err'] = "Server error.";
        return;
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

  public function getPlans($uid, &$errors) {
    try {
      $query = "SELECT * FROM plans WHERE id IN (
        SELECT plan_id FROM plan_editors WHERE user_id = ?
      )";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $uid);
      $stmt->execute();
      $results = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

      for ($i = 0; $i < count($results); $i++) {
        $result = $results[$i];

        //Get colabs
        $query = "SELECT user_id, image, display_name, mail FROM users WHERE user_id IN (SELECT user_id FROM plan_editors WHERE plan_id = ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $result["id"]);
        $stmt->execute();
        $results[$i]["colabs"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        //Get locations
        $query = "SELECT * FROM plan_locations WHERE plan_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $result["id"]);
        $stmt->execute();
        $results[$i]["locations"] = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        //Count number of days
        $query = "SELECT COUNT(DISTINCT date_order) AS number_of_days FROM plan_details WHERE plan_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $result["id"]);
        $stmt->execute();
        $results[$i]["numberOfDays"] = $stmt->get_result()->fetch_assoc()["number_of_days"];
      }

      return $results;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function getPlanGeneral($uid, $plan_id, $is_viewer = false) {
    try {
      if ($is_viewer) {
        $query = "SELECT * FROM plans WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $plan_id);
      } else {
        $query = "SELECT * FROM plans WHERE (SELECT COUNT(*) FROM plan_editors WHERE plan_id = ? AND user_id = ?) = 1
      AND id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isi", $plan_id, $uid, $plan_id);
      }
      $stmt->execute();
      $result = $stmt->get_result()->fetch_assoc();
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function checkPlanViewPermission($plan_id, $user_id, &$errors) {
    try {
      $query = "SELECT * FROM plans WHERE id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $plan_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_assoc();

      if ($result["mode"] == 1)
        $isPublic = true;
      else $isPublic = false;

      $query = "SELECT COUNT(*) AS valid FROM plan_editors WHERE plan_id = ? AND user_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("is", $plan_id, $user_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_assoc();

      return [$isPublic, $result["valid"] === 1];

    } catch (Exception $e) {
      return false;
    }
  }

  public function getPlanColabs($uid, $plan_id, $is_viewer = false) {
    try {
      if ($is_viewer) {
        $query = "SELECT display_name, image, user_id, mail FROM users 
        WHERE user_id IN (SELECT user_id FROM plan_editors WHERE plan_id = ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $plan_id);
      } else {
        $query = "SELECT display_name, image, u1.user_id, mail FROM users u1 JOIN 
        (SELECT * FROM plan_editors WHERE plan_id IN 
        (SELECT plan_id FROM plan_editors WHERE plan_id = ? AND user_id = ?)) 
        AS R2 ON u1.user_id = R2.user_id ";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $plan_id, $uid);
      }
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getPlanLocations($uid, $plan_id, $is_viewer = false) {
    try {
      if ($is_viewer) {
        $query = "SELECT location_id, location_name, location_image FROM plan_locations WHERE plan_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $plan_id);
      } else {
        $query = "SELECT location_id, location_name, location_image FROM plan_locations WHERE plan_id IN 
        (SELECT plan_id FROM plan_editors WHERE plan_id = ? AND user_id = ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $plan_id, $uid);
      }
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
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
    $sql = "DELETE FROM plans WHERE id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $plan_id);
    $stmt->execute();
    if ($stmt->affected_rows != 1){
      $errors["server_err"] = "Error occurred!!!";
    }
  }
}