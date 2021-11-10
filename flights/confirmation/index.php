<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Flight Confirmation</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="../style.css">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?php 
            include '../../shared/php/header.php';
        ?>

        <div class="container-fluid mb-4" style="margin-top: 80px;">
            <div class="container search-result-div mt-4">
                <div class="row">
                    <div class="col-md-4 col-sm-12 summary-box">
                        <h5 class="mb-3 your-flight">your flight</h5>
                        <hr class="overlap-hr">
                        <div class="depart-summary-div row">
                            <div class="col-md-12 col-sm-6 d-flex align-items-center justify-content-start">
                                <span class="flight-order">1</span>
                                <div class="ml-2 div-purple">
                                    <p id="depart-date" class="mb-1 mt-1"></p>
                                    <span>
                                        <span id="depart-summary-from"></span> <i class="fas fa-arrow-right"></i> 
                                        <span id="depart-summary-to"></span>
                                    </span>
                                </div>
                            </div>
                            <div id="depart-chosen" class="col-md-12 col-sm-6 mt-md-3 mt-sm-0">
                                <div>
                                    <img id="img-depart-airline" src="" alt="">
                                    <span class="depart-airline-name ml-1"></span>
                                </div>
                                <p id="depart-aircraft" class="mt-1 mb-1"></p>
                                <div class="d-flex justify-content-between">
                                    <div class="text-center mr-2">
                                        <p id="depart-depart-time" class="mt-1 mb-1"></p>
                                        <p id="depart-depart-airport-code" class="summary-airport-code mt-1 mb-1"></p>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-center">
                                        <span><i class="fas fa-plane"></i></span>    
                                    </div>
                                    <div class="text-center mr-2">
                                        <p id="depart-arrive-time" class="mt-1 mb-1"></p>
                                        <p id="depart-arrive-airport-code" class="summary-airport-code mt-1 mb-1"></p>
                                    </div>
                                    <div class="mr-2 d-flex flex-column align-items-center justify-content-start">
                                        <p id="depart-duration" class="mt-1 mb-1"></p>
                                        <p class="mt-1 mb-1">Direct</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="return-sum">
                            <hr class="overlap-hr">
                            <div class="return-summary-div row">
                                <div class="col-md-12 col-sm-6 d-flex align-items-center justify-content-start">
                                    <span class="flight-order">2</span>
                                    <div class="ml-2 div-purple">
                                        <p id="return-date" class="mb-1 mt-1"></p>
                                        <span>
                                            <span id="return-summary-from"></span> <i class="fas fa-arrow-right"></i> 
                                            <span id="return-summary-to"></span>
                                        </span>
                                    </div>
                                </div>
                                <div id="return-chosen" class="col-md-12 col-sm-6 mt-md-3 mt-sm-0">
                                    <div>
                                        <img id="img-return-airline" src="" alt="">
                                        <span class="return-airline-name ml-1"></span>
                                    </div>
                                    <p id="return-aircraft" class="mt-1 mb-1"></p>
                                    <div class="d-flex justify-content-between">
                                        <div class="text-center mr-2">
                                            <p id="return-depart-time" class="mt-1 mb-1"></p>
                                            <p id="return-depart-airport-code" class="summary-airport-code mt-1 mb-1"></p>
                                        </div>
                                        <div class="d-flex align-items-center justify-content-center">
                                            <span><i class="fas fa-plane"></i></span>    
                                        </div>
                                        <div class="text-center mr-2">
                                            <p id="return-arrive-time" class="mt-1 mb-1"></p>
                                            <p id="return-arrive-airport-code" class="summary-airport-code mt-1 mb-1"></p>
                                        </div>
                                        <div class="mr-2 d-flex flex-column align-items-center justify-content-start">
                                            <p id="return-duration" class="mt-1 mb-1"></p>
                                            <p class="mt-1 mb-1">Direct</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="overlap-hr">
                        <div class="">
                            <p class="mt-1 mb-1">total price:</p>
                            <span id="container-total-price"><span id="total-price">0 USD</span>/ <span id="number-of-pax">1 </span>pax</span>
                            <button id="btn-confirm">change flight</button>
                        </div>
                    </div>
                    <div class="col-md-8 col-sm-12 pl-4 mt-md-0 mt-sm-2">
                        <h3 id="remaining-time">remaining time: 10:00</h3>
                        <h4 class="text-purple">number of Passengers: 
                            <select name="pax" id="pax">
                                <option value="1" selected="selected">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                        </h4>

                        <div class="warning">
                            <p class="text-red font-italic font-weight-bold mb-0">please check your information carefully before booking.</p>
                            <p class="text-red font-italic font-weight-bold">further modifications may require an additional fee after booking is confirmed.</p>
                        </div>

                        <div id="pax-input-section">
                            <div class="pax-input mt-3 mb-3" data-pax-id="1">
                                <h4 class="text-pink mb-4">passenger 1</h4>
                                <label for="title">title</label>
                                <select name="title" class="title-select">
                                    <option value="Mr" selected="selected">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Mdm">Mdm</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Mstr">Mstr</option>
                                    <option value="Dr">Dr</option>
                                    <option value="Prof">Prof</option>
                                    <option value="PhD">PhD</option>
                                </select>
                                <label for="dob">date of birth</label>
                                <!-- <input type="text" name="dob" class="dob" id="dob" placeholder="date of birth" required> -->
                                <input type="date" name="dob" class="dob" required>
                                <div class="input-div">
                                    <label for="first">middle and first/given name (as in Passport)</label>
                                    <input type="text" name="first" class="first" required>
                                </div>
                                <div class="input-div">
                                    <label for="first">last/given name (as in Passport)</label>
                                    <input type="text" name="last" class="last" required>
                                </div>
                                <div class="input-div">
                                    <label for="first">passport</label>
                                    <input type="text" name="passport" class="passport" required>
                                </div>
                            </div>
                        </div>

                        <button id="btn-check">confirm</button>
                        <button id="btn-book">book</button>
                    </div>
                </div>
            </div>


        </div>

        <!-- Loading modal -->
        <div class="modal" id="loading-modal" 
        data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body p-4">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="display: none;">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="text-center">Loading</h4>
                        <div class="d-flex justify-content-center mt-4">
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error Modal -->
        <div class="modal fade" id="error-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body p-4">
                        <p id="modal-error-content"></p>
                        <button type="button" class="btn btn-danger" data-dismiss="modal" style="float: right;">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="tmp"></div>

        <!-- CSRF Token -->
        <p id="csrf-flight-payment" style="display: none"><?php echo $_SESSION['csrf']; ?></p>

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
        
        <!-- Project JavaScript -->
        <script src="./../../shared/js/firebase.js"></script>
        <script src="./email.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>