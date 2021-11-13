<?php
class getInfoByPeriod{
  public function weekOfYear($date) {
    $weekOfYear = intval(date("W", $date));
    if (date('n', $date) == "1" && $weekOfYear > 51) {
        // It's the last week of the previos year.
        return 0;
    }
    else if (date('n', $date) == "12" && $weekOfYear == 1) {
        // It's the first week of the next year.
        return 53;
    }
    else {
        // It's a "normal" week.
        return $weekOfYear;
    }
  }

  public function weekOfMonth($date) {
        //Get the first day of the month.
      $firstOfMonth = strtotime(date("Y-m-01", $date));
        //Apply above formula.
      return $this->weekOfYear($date) - $this->weekOfYear($firstOfMonth) + 1;
      }
    
    public function executeReturnObjects($list, $period) {
        date_default_timezone_set('Asia/Ho_Chi_Minh');
        
        if ($period == "Y") {
          $identifiers = [];
          while (count($identifiers) != 13) {
            $count = count($identifiers);
            $currentTarget = new DateTime("- {$count} month");
            $pushObject = new stdClass();
            $pushObject->month = intval($currentTarget->format('m'));
            $pushObject->year = intval($currentTarget->format('Y'));
            $pushObject->sum = 0;
            array_push($identifiers, $pushObject);
          }
    
          foreach ($list as $booking) {
            //var_dump($booking);
            $date = new DateTime($booking["date_booked"]);
            $date->modify("+7 hours");
            $month = intval($date->format('m'));
            $year = intval($date->format('Y'));
            
            for ($i = 0; $i < count($identifiers); $i++) {
              if ($month == $identifiers[$i]->month && $identifiers[$i]->year == $year) {
                $identifiers[$i]->sum += 1;
              }
            }
          }
          return $identifiers;
        }
        else if ($period == "Q") {
          $identifiers = [];
          while (count($identifiers) != 12) {
            $count = count($identifiers);
            $weekStart = new DateTime("- {$count} week");
            $weekStart->modify("monday this week");
            $weekEnd = clone $weekStart;
            $weekEnd->modify("sunday this week");
            $weekEnd->setTime(23, 59, 59);
            $pushObject = new stdClass();
            $pushObject->month = intval($weekStart->format('m'));
            $pushObject->year = intval($weekStart->format('Y'));
            $get = strtotime($weekStart->format('Y-m-d H:i:s'));
            $pushObject->week = $this->weekOfMonth($get);
            $pushObject->startOfWeek = clone $weekStart;
            $pushObject->endOfWeek = clone $weekEnd;
            $pushObject->sum = 0;
            array_push($identifiers, $pushObject);
          }
    
          foreach ($list as $booking) {
            $date = new DateTime($booking["date_booked"]);
            $date->modify("+7 hours");
    
            for ($i = 0; $i < count($identifiers); $i++) {
              if ($date >= $identifiers[$i]->startOfWeek && $identifiers[$i]->endOfWeek >= $date) {
                $identifiers[$i]->sum += 1;
              }
            }
          }
    
          $returnArray = [];
          foreach ($identifiers as $identifier) {
            $pushObject = new stdClass();
            $pushObject->month = $identifier->month;
            $pushObject->week = $identifier->week;
            $pushObject->sum = $identifier->sum;
            array_push($returnArray, $pushObject);
          }
    
          return $returnArray;
        }
        else if ($period == "M") {
          $identifiers = [];  
          while (count($identifiers) != 30) {
            $count = count($identifiers);
            $weekStart = new DateTime("- {$count} day");
            $pushObject = new stdClass();
            $pushObject->month = intval($weekStart->format('m'));
            $pushObject->year = intval($weekStart->format('Y'));
            $pushObject->day = intval($weekStart->format('d'));
            $pushObject->sum = 0;
            array_push($identifiers, $pushObject);
          }
    
          foreach ($list as $booking) {
            $date = new DateTime($booking["date_booked"]);
            $date->modify("+7 hours");
            $month = intval($date->format('m'));
            $day = intval($date->format('d'));
            $year = intval($date->format('Y'));
            
            for ($i = 0; $i < count($identifiers); $i++) {
              if ($month == $identifiers[$i]->month && $identifiers[$i]->year == $year && $identifiers[$i]->day == $day) {
                $identifiers[$i]->sum += 1;
              }
            }
          }
          
          $returnArray = [];
          foreach ($identifiers as $identifier) {
            $pushObject = new stdClass();
            $pushObject->month = $identifier->month;
            $pushObject->day = $identifier->day;
            $pushObject->sum = $identifier->sum;
            array_push($returnArray, $pushObject);
          }
    
          return $returnArray;
        }
        else if ($period == "W") {
          $identifiers = [];  
          while (count($identifiers) != 7) {
            $count = count($identifiers);
            $weekStart = new DateTime("- {$count} day");
            $pushObject = new stdClass();
            $pushObject->month = intval($weekStart->format('m'));
            $pushObject->year = intval($weekStart->format('Y'));
            $pushObject->day = intval($weekStart->format('d'));
            $pushObject->sum = 0;
            array_push($identifiers, $pushObject);
          }
    
          foreach ($list as $booking) {
            $date = new DateTime($booking["date_booked"]);
            $date->modify("+7 hours");
            $month = intval($date->format('m'));
            $day = intval($date->format('d'));
            $year = intval($date->format('Y'));
            
            for ($i = 0; $i < count($identifiers); $i++) {
              if ($month == $identifiers[$i]->month && $identifiers[$i]->year == $year && $identifiers[$i]->day == $day) {
                $identifiers[$i]->sum += 1;
              }
            }
          }
          
          $returnArray = [];
          foreach ($identifiers as $identifier) {
            $pushObject = new stdClass();
            $pushObject->month = $identifier->month;
            $pushObject->day = $identifier->day;
            $pushObject->sum = $identifier->sum;
            array_push($returnArray, $pushObject);
          }
    
          return $returnArray;
        }
    }
}
?>