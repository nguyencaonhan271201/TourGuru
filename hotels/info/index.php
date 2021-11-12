<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Hotel Info</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="style.css">

        <!-- Slider -->
        <link rel="stylesheet" href="https://unpkg.com/swiper@7/swiper-bundle.min.css"/>
    </head>
    <body>
        <?php 
            include '../../shared/php/header.php';
        ?>

        <div class="container mb-4 d-flex justify-content-center" style="margin-top: 80px;">
            <div class="main-container">
                <div class="hotel-info-head">
                    <div class="row" style="width: 100%; margin: 0 auto">
                        <div class="col-md-9 col-sm-12 ">
                            <div class="hotel-option-info d-flex align-items-start flex-column">
                                <h3 class="hotel-option-name"></h3>
                                <p class="hotel-option-star">

                                </p>
                                <p class="text-gray mb-1"><i class="fas fa-map-marked-alt">
                                </i> <span class="hotel-address"></span></p>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-12 hotel-option-rating-div d-flex align-items-end flex-column justify-content-end">
                            <h3 class="hotel-option-rating"></h3>
                            <h4 class="hotel-option-type"></h4>
                        </div>
                    </div>
                    
                    <div class="head-img row mt-3 mb-2" style="width: 100%; margin: 0 auto">
                        <div class="col-md-4 col-sm-12 image-head-left pr-md-1 pr-sm-0 pl-0 pt-1 pb-1">
                            <img src="https://i.pinimg.com/originals/e1/80/4e/e1804e9f5a5c4893167f45873342faba.gif" alt="">
                            <img src="https://i.pinimg.com/originals/e1/80/4e/e1804e9f5a5c4893167f45873342faba.gif" alt="">
                        </div>
                        <div class="head-img-right col-md-8 col-sm-12 pl-md-1 pl-sm-0 pt-1 pb-1 pr-0">
                            <img src="https://i.pinimg.com/originals/e1/80/4e/e1804e9f5a5c4893167f45873342faba.gif" alt="">
                        </div>
                    </div>

                    <div class="swiper slider">
                        <div class="swiper-wrapper">
                            
                        </div>
                    </div>
                </div>

                <div class="hotel-info-body mt-4 mb-4">
                    <div class="row overview" style="width: 100%; margin: 0 auto;">
                        
                    </div>

                    <!-- 
                    <div class="amenities mt-3">
                        <div class="in-the-hotel mb-1">
                            <h4 class="amenity-title"><i class="fas fa-hotel"></i> In the Hotel</h4>
                            <div id="in-the-hotel-amenities">

                            </div>
                        </div>

                        <div class="in-the-hotel mt-1">
                            <h4 class="amenity-title"><i class="fas fa-hotel"></i> In the Room</h4>
                            <div id="in-the-room-amenities">
                                
                            </div>
                        </div>
                    </div>
                     -->

                    <div class="policies mt-3">
                        <h4 class="amenity-title"><i class="fa fa-info" aria-hidden="true"></i> Policies & Information</h4>
                        <div id="hotel-policies" class="row"></div>
                    </div>
                </div>

                <div class="booking-hide">
                    <h3 class="hotel-option-name">book now</h3>
                    <div class="search-div container d-flex align-items-center justify-content-center">
                        <form id="flight-search-form" method="post" action="#">
                            <div class="ml-md-3 ml-sm-0 d-flex" id="horizontal-upper-form-div">
                                <label for="currency" class="mb-0 mr-2">currency</label>
                                <select name="currency" id="currency">
                                    <option value="USD" selected="selected">USD</option>
                                </select>
                            </div>
                            <div class="p-1" id="main-search-form">
                                <div class="row m-0" style="height: 100%; width: 100%;">
                                    <div id="date-search-div" class="col-md-9 col-sm-12 d-flex p-0 mb-sm-2">
                                        <div class="input-block">
                                            <span class="d-flex align-items-center">
                                                <i class="fa fa-calendar ml-2 mr-2" aria-hidden="true"></i>
                                                <input name="check-in" id="check-in" placeholder="check-in">
                                            </span>
                                        </div>
                                        <div class="input-block right-most">
                                            <span class="d-flex align-items-center">
                                                <i class="fas fa-calendar ml-2 mr-2"></i>
                                                <input name="check-out" id="check-out" placeholder="check-out">
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-md-3 col-sm-12 d-flex p-0">
                                        <div class="input-block btn-search-block">
                                            <button id="btn-search-form">
                                                <i class="fa fa-search mr-1" aria-hidden="true"></i>Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="booking">
                    <h3 class="hotel-option-name">booking</h3>
                    <div class="booking-summary">
                        <div class="row">
                            <div class="col-md-6 col-sm-12 pr-md-6 pr-0 d-flex align-items-center justify-content-center">
                                <img src="" alt="" id="booking-summary-img">
                            </div>
                            <div class="col-md-6 col-sm-12 d-flex align-items-center pl-md-6 pr-0">
                                <div>
                                    <h4 class="text-purple" id="nights-count"></h4>
                                    <h5 class="text-dark-purple" id="nights-range"></h5>
                                    <h5 class="text-purple">number of rooms: 
                                        <select name="rooms" id="rooms">
                                            <option value="1" selected="selected">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </h5>
                                    <p class="mt-1 mb-1">total price:</p>
                                    <span id="container-total-price"><span id="total-price">0 USD</span>/ <span id="number-of-rooms">1 room</span></span>
                                    <div class="mt-2">
                                        <button id="btn-search">change hotel</button>
                                    </div>
                                    <div class="mt-2">
                                        <button id="btn-book">confirm booking</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div id="map" style="width:100%; height:400px;" class="mt-3 mb-3"></div>                 -->

                <!-- <div class="text-center">
                    <a id="btn-search" href="../">search for another hotel</a>
                </div> -->
            </div>
        </div>

        <div class="image-box">
            <img src="" alt="">
        </div>

        <!-- CSRF Token -->
        <p id="csrf-hotel-info" style="display: none"><?php echo $_SESSION['csrf']; ?></p>

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
        
        <!-- Slider -->
        <script src="https://unpkg.com/swiper@7/swiper-bundle.min.js"></script>
        
        <!-- DatePicker -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/litepicker/2.0.11/litepicker.js"></script>
        
        <!-- Google Maps -->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBL9TVw2Kc5YxiB1-gLThdttgvhcYP1Mtg&libraries=&v=weekly&channel=2"></script>

        <!-- Project JavaScript -->
        <script src="./../../shared/js/firebase.js"></script>
        <script src="./email.js"></script>
        <script src="./../../shared/js/classes/Hotel.js"></script>
        <script src="./main.js"></script>

    </body>
</html>

<?php ?>