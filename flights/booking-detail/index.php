<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Flight Booking Detail</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <!-- <link rel="stylesheet" href="../style.css"> -->
        <link rel="stylesheet" href="https://dl.dropboxusercontent.com/s/y21djh0zpw4mzmw/style.css?dl=1">
        <link rel="stylesheet" href="https://dl.dropboxusercontent.com/s/j1esxeiig2638wh/style1.css?dl=1">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?php 
            include '../../shared/php/header.php';
        ?>

        <div class="container-fluid mb-4 d-flex justify-content-center" style="margin-top: 80px;">
            <div class="booking-detail" id="booking-detail" style="position:relative;">
                <div id="print-block">
                    <!-- <a href="#" id="download"><i class="fas fa-save    "></i></a> -->
                    <button class="btn-print" id="print"><i class="fas fa-print"></i></button>
                </div>
                <div class="agency-detail">
                    <img id="agency-logo" src="https://firebasestorage.googleapis.com/v0/b/tour-guru-25442.appspot.com/o/logo.svg?alt=media&token=ca6b15e1-bce5-4d6b-be8d-8d834788d043" alt="">
                    <div class="agency-name">
                        <h2>Tour Guru</h2>
                    </div>
                </div>
                <div id="depart-div">
                    <h4 class="text-purple">Forward Flight</h4>
                    
                </div>
                <div id="return-div">
                    <h4 class="text-purple">Return Flight</h4>
                </div>

                <hr>
                <h4 class="text-pink">total price</h4>
                <span id="container-total-price"><span id="total-price">0 USD</span></span>
                <hr>
                <h4 class="text-pink">payment info</h4>
                <p class="payment-content">
                    <span id="hotel-name-span">Tour Guru</span> handles all the payment processes required.
                </p>
                <p class="payment-content">
                    payment methods accepted: American Express, Visa, Mastercard, Diners Club, JCB, Maestro, Discover, Bankcard, UnionPay Debit, UnionPay Credit
                </p>
                <hr>
                <h4 class="text-pink">policies</h4>
                <p class="payment-content text-red">
                    100% of the total fee must be completed in order for the booking to be valid. 
                </p>
            </div>


        </div>

        <!-- Firebase -->
        <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-auth-compat.js"></script>
        
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        
        <!-- SweetAlert -->
        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js"></script>
        
        <!-- Project JavaScript -->
        <script src="./../../shared/js/firebase.js"></script>
        <script src="./../../shared/js/classes/Flight.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>