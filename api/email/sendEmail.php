<?php 
  date_default_timezone_set('Asia/Ho_Chi_Minh');   

  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;
  include 'library.php';
  require 'vendor/autoload.php';

  function sendEmail($to, $display, $subject, $body, &$error) {
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
          if (!$result) {
            $error = true;
            return;
          }
      } catch (Exception $e) {
        $error = true;
        $return;
      }
  }
?>