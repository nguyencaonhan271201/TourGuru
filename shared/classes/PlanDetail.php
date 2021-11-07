<?php
class PlanDetail {
  public $iterations = [];
  public $conn;

  public function __construct($conn) {
    $this->setConn($conn);
  }

  public function setConn($conn) {
    $this->conn = $conn;
  }

  public function addPlanDetails($details, &$errors) {
    try {
      foreach ($details as $detail) {
        $query = "INSERT INTO plan_details(plan_id, destination_id, destination_name, destination_image, detail, date, start,
        set_alarmed) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);

        $valueInsert = [];

        foreach ($detail as $key => $value) {
          if ($key == "plan_id")
            array_push($valueInsert, intval(htmlspecialchars($value)));
          else if ($key == "set_alarmed") 
            array_push($valueInsert, $value == true? 1 : 0);
          else
            array_push($valueInsert, htmlspecialchars($value));
        }

        $stmt->bind_param("issssssi", ...$valueInsert);

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