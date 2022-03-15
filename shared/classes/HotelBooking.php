<?php
class HotelBooking {
  public $id;
  public $user_id;
  public $date_start;
  public $date_end;
  public $conn;
  public $number_of_nights;
  public $number_of_rooms;
  public $date_booked;
  public $total_cost;
  public $status;
  public $hotelInfo;

  public function __construct($conn) {
    $this->setConn($conn);
  }

  public function setConn($conn) {
    $this->conn = $conn;
  }

  public function setID($id) {
    $this->id = intval($id);
  }

  public function addBookingInfo($data, &$errors) {
    try {

      //Insert the hotel
      $hotel_fields = ["name", "image_url", "address", "stars"];
      foreach ($hotel_fields as $hotel_field) {
        if (!isset($data["hotel"][$hotel_field])) {
          $errors[$hotel_field] = "Missing data.";
          return;
        }
      }

      $query = "INSERT INTO hotels(name, image_url, address, stars) VALUES (?, ?, ?, ?)";
      $stmt = $this->conn->prepare($query);

      $valueInsert = [];

      foreach ($data["hotel"] as $key => $value) {
        if ($key == "stars") {
          array_push($valueInsert, floatval(htmlspecialchars($value)));
        } else {
          array_push($valueInsert, htmlspecialchars($value));
        }
      }

      $stmt->bind_param("sssd", ...$valueInsert);

      $stmt->execute();
      
      $hotel_id = -1;

      if ($stmt->affected_rows == 1) {
          $hotel_id = $stmt->insert_id;
      } else {
          $errors['execute_err'] = "Server error.";
          return;
      } 

      //List of fields
      $fields = ["user_id", "date_start", "date_end", "number_of_nights", "total_cost"];

      foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] == "") {
          $errors[$field] = "Missing data.";
          return;
        }
      }

      // $new_url = str_replace("_z", "_w", $data["hotel_image_url"]);
      // $data["hotel_image_url"] = $new_url;

      $query = "INSERT INTO hotel_bookings(user_id, date_start, date_end, number_of_nights, approved, total_cost, hotel_id) 
      VALUES (?, ?, ?, ?, 0, ?, ?)";
      $stmt = $this->conn->prepare($query);

      $valueInsert = [];

      foreach ($data as $key => $value) {
        if ($key != "hotel") {
          if ($key == "number_of_nights" || $key == "number_of_beds") {
            array_push($valueInsert, intval(htmlspecialchars($value)));
          } else {
            array_push($valueInsert, htmlspecialchars($value));
          }
        }
      }

      array_push($valueInsert, intval($hotel_id));

      $stmt->bind_param("sssisi", ...$valueInsert);

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

  public function addBookingDetails($details, $bookingID, &$errors) {
    try {
      foreach ($details as $detail) {
        $query = "INSERT INTO hotel_booking_details(booking_id, room_name, room_image, number_of_room, single_cost, currency) 
        VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query); 

        $stmt->bind_param("issids", intval($bookingID), $detail["room_name"], $detail["room_image"],
        intval($detail["number_of_room"]), floatval($detail["single_cost"]), $detail["currency"]);

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

  public function getHotelBookingInfo($user_id, $booking_id) {
    try {
      $query = "SELECT id, user_id, date_start, date_end, number_of_nights, approved, date_booked, total_cost,
      (SELECT name FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_name,
      (SELECT image_url FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_image_url,
      (SELECT address FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_address,
      (SELECT stars FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_stars,
      (SELECT SUM(number_of_room) FROM hotel_booking_details h2 WHERE h2.booking_id = h1.id) AS number_of_beds
      FROM hotel_bookings h1 WHERE id = ? AND user_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("is", $booking_id, $user_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_assoc();
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getHotelBookingDetails($booking_id) {
    try {
      $query = "SELECT * FROM hotel_booking_details WHERE booking_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $booking_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getHotelBookingInfoAdmin($user_id, $booking_id) {
    try {
      $query = "SELECT * FROM users WHERE user_id = ? AND role = 0";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $user_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

      if (count($result) != 1) {
        return;
      }

      $query = "SELECT id, user_id, date_start, date_end, number_of_nights, approved, date_booked, total_cost,
      (SELECT name FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_name,
      (SELECT image_url FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_image_url,
      (SELECT address FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_address,
      (SELECT stars FROM hotels h WHERE h.hotel_id = h1.hotel_id) AS hotel_stars,
      (SELECT SUM(number_of_room) FROM hotel_booking_details h2 WHERE h2.booking_id = h1.id) AS number_of_beds
      FROM hotel_bookings h1 WHERE id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $booking_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_assoc();
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function getHotelBookingDetailsAdmin($user_id, $booking_id) {
    try {
      $query = "SELECT * FROM users WHERE user_id = ? AND role = 0";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $user_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

      if (count($result) != 1) {
        return;
      }

      $query = "SELECT * FROM hotel_booking_details WHERE booking_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", intval($booking_id));
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      return;
    }
  }

  public function deleteBooking($uid, $booking_id, &$errors) {
    $sql = "DELETE FROM hotel_bookings WHERE user_id = ? AND id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("si", $uid, $booking_id);
    $stmt->execute();
    if ($stmt->affected_rows != 1){
      $errors["server_err"] = "Error occurred!!!";
    }
  }
}