<?php 
    date_default_timezone_set('Asia/Ho_Chi_Minh');   

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
	include 'library.php';
    require 'vendor/autoload.php';
	include '../api/db.php';

    function sendEmail($to, $display, $subject, $body) {
        $mail = new PHPMailer(true);

        try {
            $mail->CharSet = "UTF-8";
            $mail->SMTPDebug = 0;                                 
            $mail->isSMTP();                
            $mail->Host = SMTP_HOST;  
            $mail->SMTPAuth = true;                           
            $mail->Username = SMTP_UNAME;     
            $mail->Password = SMTP_PWORD;                       
            $mail->SMTPSecure = 'ssl';                       
            $mail->Port = SMTP_PORT;                    
            //Recipients
            $mail->setFrom(SMTP_UNAME, "TourGuru");
            $mail->addAddress($to, $display);     
            $mail->isHTML(true);                                 
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->AltBody = "";
            $result = $mail->send();
            echo "Param for send: {$to} - {$display} - {$subject} - {$body}";
            if (!$result) {
                $error = "Có lỗi xảy ra trong quá trình gửi mail";
                echo "alert('Error');";
            } else {
                echo "Send complete {$subject}";
            }
        } catch (Exception $e) {
            echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
        }
    }

    function selectEventsAvailable() {
        global $conn;

        $currentFullDate = new DateTime();
        $currentDateString = $currentFullDate->format("Y-m-d");

        $currentNextDate = new DateTime('+1 day');
        $currentNextDateString = $currentNextDate->format("Y-m-d");

        $query = "SELECT p.*, (SELECT plan_title FROM plans p1 WHERE p1.id = p.plan_id) AS plan_title,
        (SELECT u.mail FROM users u, plans p1 WHERE p1.user_id = u.user_id AND p1.id = p.plan_id) AS email,
        (SELECT u.display_name  FROM users u, plans p1 WHERE p1.user_id = u.user_id AND p1.id = p.plan_id) AS display_name
        FROM plan_details p WHERE set_alarmed = true AND (date = ? OR date = ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $currentDateString, $currentNextDateString);
        $stmt->execute();
        $results = $stmt->get_result();
        $events = $results->fetch_all(MYSQLI_ASSOC);

        foreach ($events as $event) {   
            $dateNext10Mins = new DateTime('+ ' . strval($event["minute_alarm"]) . ' minutes');
            $dateNext10Mins2 = new DateTime('+ ' . strval($event["minute_alarm"]) . ' minutes');

            //Check if the event is in the list
            $dateString = "{$event["date"]} {$event["start"]}:30";
            $date = DateTime::createFromFormat('Y-m-d H:i:s', $dateString);

            if (isBetween($date, $dateNext10Mins, $dateNext10Mins2)) {
                $upperCasedTitle = strtoupper($event["plan_title"]);

                $planContent = "";
                if ($event["detail"] != "") {
                    $planContent .= $event["detail"] . ". ";
                }
                if ($event["destination_name"] != "") {
                    $planContent .= "Visit " . "<b>" . $event["destination_name"] . "</b>";
                }

                $body = "<b style=\"color: #a082af;\">Tour Guru</b> reminds you of the following plan: <p style=\"color: #c95998;\">{$date->format("d/m/Y")} - {$event["start"]}: {$planContent}</p>";

                sendEmail($event["email"], $event["display_name"], "ALARM FOR PLAN {$upperCasedTitle} AT {$event["start"]}", $body);
            }
        }
    }

    function isBetween($date, $startTime, $endTime) {
        $startTimeModified = $startTime;
        $startTimeModified->setTime($startTimeModified->format("H"), $startTimeModified->format("i"), 0);

        $endTimeModified = $endTime;
        $endTimeModified->setTime($endTimeModified->format("H"), $endTimeModified->format("i"), 59);

        return $date >= $startTimeModified && $date <= $endTimeModified;
    }

    selectEventsAvailable();
?>