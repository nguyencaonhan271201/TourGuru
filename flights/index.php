<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Flights</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>    
        <?php 
            include '../shared/php/header.php';
        ?>

        <div class="container-fluid" id="main-container" style="position: relative;">
            <div id="carousel" class="carousel slide" data-ride="carousel">
                <div id="carousel-backdrop"></div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/1.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/9.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/2.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/8.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/3.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/10.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/4.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/7.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/5.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/flights/6.jpg" alt="">
                    </div>
                </div>
            </div>

            <div class="search-div container d-flex align-items-center justify-content-center">
                <form id="flight-search-form" method="post" action="#">
                    <div class="d-flex" id="horizontal-upper-form-div">
                        <select name="flight-type" id="flight-type">
                            <option value="oneway">One-way</option>
                            <option value="round" selected="selected">Round-trip</option>
                        </select>
                        <select name="class" id="class">
                            <option value="Y" selected="selected">Economy</option>
                            <option value="W">Premium Economy</option>
                            <option value="J">Business</option>
                            <option value="F">First</option>
                        </select>
                        <select name="currency" id="currency">
                            <option value="USD" selected="selected">USD</option>
                        </select>
                    </div>
                    <div class="p-1" id="main-search-form">
                        <div class="row m-0" style="height: 100%; width: 100%;">
                            <div id="airport-search-div" class="col-md-5 col-sm-12 d-flex p-0  mb-sm-2">
                                <div class="input-block input-block-abs">
                                    <span class="d-flex align-items-center header-search">
                                        <i class="fas fa-plane-departure ml-2 mr-2"></i>
                                        <input type="text" name="from" id="from" placeholder="origin"></input>
                                    </span>
                                    <div id="search-flight-from-result" class="header-search-result">

                                    </div>
                                </div>
                                <div class="input-block-m">
                                    <button style="background: none; border: none;" class="d-flex align-items-center">
                                        <i class="ml-2 mr-2 fas fa-exchange-alt" id="btn-exchange"></i>
                                    </button>
                                </div>
                                <div class="input-block right-most input-block-abs">
                                    <span class="d-flex align-items-center">
                                        <i class="fas fa-plane-arrival ml-2 mr-2"></i>
                                        <input type="text" name="to" id="to" placeholder="destination"></input>
                                    </span>
                                    <div id="search-flight-to-result" class="header-search-result">

                                    </div>
                                </div>
                            </div>
                            <div id="date-search-div" class="col-md-5 col-sm-12 d-flex p-0 mb-sm-2">
                                <div class="input-block">
                                    <span class="d-flex align-items-center">
                                        <i class="fas fa-calendar ml-2 mr-2"></i>
                                        <input type="text" name="depart" id="depart" placeholder="depart">
                                    </span>
                                </div>
                                <div class="input-block right-most">
                                    <span class="d-flex align-items-center">
                                        <i class="fas fa-calendar ml-2 mr-2"></i>
                                        <input type="text" name="arrival" id="arrival" placeholder="return">
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-2 col-sm-12 d-flex p-0">
                                <div class="input-block btn-search-block">
                                    <button id="btn-search">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

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
                            <span id="container-total-price"><span id="total-price">0 USD</span>/ pax</span>
                            <button id="btn-confirm">next</button>
                        </div>
                    </div>
                    <div class="col-md-8 col-sm-12 pl-4">
                        <div id="depart-div">
                            <h2 id="depart-date-h2" class="mt-1"></h2>

                            <div id="depart-choices">

                            </div>
                        </div>
                        <div id="return-div">
                            <h2 class="mt-1" id="return-date-h2"></h2>

                            <div id="return-choices">

                            </div>
                        </div>
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

        <!-- CSRF Token -->
        <p id="csrf" style="display: none"><?php echo $_SESSION['csrf']; ?></p>

        <!-- Firebase -->
        <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-auth-compat.js"></script>
        
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        
        <!-- DatePicker -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/litepicker/2.0.11/litepicker.js"></script>
        
        <!-- SweetAlert -->
        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        
        <!-- Project JavaScript -->
        <script src="./../shared/js/firebase.js"></script>

        <!-- Module imports  -->
        <script src="./../shared/js/classes/Flight.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>