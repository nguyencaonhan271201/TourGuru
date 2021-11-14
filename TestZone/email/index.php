<?php 
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    if (isset($_GET['action']) && $_GET['action'] == 'send') {
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
            $mail->addAddress($_POST['to'], 'Receiver');     
            //$mail->addReplyTo(SMTP_UNAME, 'Tên người trả lời');
            $mail->isHTML(true);                                 
            $mail->Subject = $_POST['subject'];
            $mail->Body = $_POST['content'];
            $mail->AltBody = $_POST['content'];
            $result = $mail->send();
            if (!$result) {
                $error = "Có lỗi xảy ra trong quá trình gửi mail";
                echo "alert('Error');";
            }
        } catch (Exception $e) {
            echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
        }
    }
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Test Email</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body>
        
        <div class="container">
            <?php if(isset($_GET['action']) && $_GET['action'] == 'send'): ?> 
                <h5 class="text-center">Sending Email</h5>
            <?php else: ?>
                <form id="send-email-form" method="POST" action="?action=send">
                    <div class="form-group">
                    <label for="to">Send to</label>
                    <input type="email"
                        class="form-control" name="to" id="to" aria-describedby="helpId" placeholder="Send to:">
                    </div>
                    <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text"
                        class="form-control" name="subject" id="subject" aria-describedby="helpId" placeholder="Subject">
                    </div>
                    <div class="form-group">
                    <label for="content">Content</label>
                    <textarea class="form-control" name="content" id="content" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send</button>
                </form>
            <?php endif; ?>
        </div>
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    </body>
</html>