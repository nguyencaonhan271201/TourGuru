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
      //List of fields
      $fields = ["user_id", "date_start", "date_end", "number_of_nights", "hotel_id", "hotel_name", "hotel_image_url",
      "number_of_beds", "total_cost"];

      foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] == "") {
          $errors[$field] = "Missing data.";
          return;
        }
      }

      $query = "INSERT INTO hotel_bookings(user_id, date_start, date_end, number_of_nights, hotel_id, hotel_name,
      hotel_image_url, number_of_beds, total_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      $stmt = $this->conn->prepare($query);

      $valueInsert = [];

      foreach ($data as $key => $value) {
        if ($key == "number_of_nights" || $key == "number_of_beds") {
          array_push($valueInsert, intval(htmlspecialchars($value)));
        } else {
          array_push($valueInsert, htmlspecialchars($value));
        }
      }

      $stmt->bind_param("sssisssis", ...$valueInsert);

      $stmt->execute();

      if ($stmt->affected_rows == 1) {
          return;
      } else {
          $errors['execute_err'] = "Server error.";
      } 
    } catch (Exception $e) {
      $errors['execute_err'] = "Server error.";
      return;
    }
  }
}