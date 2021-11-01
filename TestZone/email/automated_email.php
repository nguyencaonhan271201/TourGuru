<?php 
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
	include 'library.php';
    require 'vendor/autoload.php';
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
        $mail->addAddress("nguyencaonhan001@gmail.com", 'Receiver');     
        $mail->isHTML(true);                                 
        $mail->Subject = "Test Automated Email";
        $mail->Body = date_format($date,"Y/m/d H:i:s");
        $mail->AltBody = date_format($date,"Y/m/d H:i:s");
        $result = $mail->send();
        if (!$result) {
            $error = "Có lỗi xảy ra trong quá trình gửi mail";
            echo "alert('Error');";
        }
    } catch (Exception $e) {
        echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
    }
?>