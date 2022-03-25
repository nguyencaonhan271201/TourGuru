<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Hotel</title>
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

        <div class="container-fluid mb-4 d-flex justify-content-center" style="margin-top: 80px;">
            <div class="main-container">
                <div class="row">
                    <div class="col-md-3 col-sm-12 order-md-1 order-2 p-md-0 p-3">
                        <div id="search-box">
                            <h4>search</h4>
                            <form>
                                <div class="form-group">
                                  <label for="property">property</label>
                                  <input type="text"
                                    class="form-control" name="property" id="property" aria-describedby="helpId" placeholder=""
                                    readonly="true">
                                </div>

                                <div class="form-group">
                                  <label for="check-in">check-in</label>
                                  <input type="text"
                                    class="form-control" name="check-in" id="check-in" aria-describedby="helpId" placeholder="">
                                </div>

                                <div class="form-group">
                                  <label for="property">check-out</label>
                                  <input type="text"
                                    class="form-control" name="check-out" id="check-out" aria-describedby="helpId" placeholder="">
                                </div>

                                <div class="row">
                                    <div class="col-md-6 col-12 pr-md-1">
                                        <div class="form-group">
                                            <label for="guests">guests</label>
                                            <select class="form-control" name="guests" id="guests">
                                                <?php 
                                                    for ($i = 1; $i <= 20; $i++) {
                                                        $selected = $i == 2? "selected" : "";
                                                        $guestOrGuests = $i == 1? "guest" : "guests";
                                                        echo "<option value=\"{$i}\" {$selected}>{$i} {$guestOrGuests}</option>";
                                                    }
                                                ?>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-12 pl-md-1">
                                        <div class="form-group">
                                            <label for="rooms">rooms</label>
                                            <select  class="form-control" name="rooms" id="rooms">
                                                <?php 
                                                    for ($i = 1; $i <= 10; $i++) {
                                                        $selected = $i == 1? "selected" : "";
                                                        $roomOrRooms = $i == 1? "room" : "rooms";
                                                        echo "<option value=\"{$i}\" {$selected}>{$i} {$roomOrRooms}</option>";
                                                    }
                                                ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 col-12 pr-md-1">
                                        <div class="form-group">
                                            <label for="guests">currency</label>
                                            <select class="form-control" name="currency" id="currency">
                                               
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-12 pb-3 pl-md-1 d-flex align-items-end justify-content-center">
                                        <a id="btn-search-booking" class="btn btn-info" href="#" role="button"
                                        style="width: 100%">
                                            search
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <img 
                            alt="" 
                            class="img-review-on-map"
                            src="https://i.pinimg.com/originals/e1/80/4e/e1804e9f5a5c4893167f45873342faba.gif">
                    </div>
                    <div class="col-md-9 col-sm-12 order-md-2 order-1">
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
                                <div class="col-md-4 col-sm-12 image-head-left pr-md-1 pr-0 pl-0 pt-1 pb-1">
                                    <img src="https://i.pinimg.com/originals/e1/80/4e/e1804e9f5a5c4893167f45873342faba.gif" alt="">
                                    <img src="https://i.pinimg.com/originals/e1/80/4e/e1804e9f5a5c4893167f45873342faba.gif" alt="">
                                </div>
                                <div class="head-img-right col-md-8 col-sm-12 pl-md-1 pl-0 pt-1 pb-1 pr-0">
                                    <img src="https://i.pinimg.com/originals/e1/80/4e/e1804e9f5a5c4893167f45873342faba.gif" alt="">
                                </div>
                            </div>

                            <div class="swiper slider">
                                <div class="swiper-wrapper">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hotel-info-body mt-2 mb-4">
                    <div class="about">
                        <h4 class="text-pink">about</h4>

                        <p style="white-space: pre-wrap"></p>
                    </div>

                    <div class="availability mt-4 mb-4">
                        <h4 class="text-pink">availability</h4>

                        <div class="table-responsive">
                        <table class="table mt-2">
                            <thead>
                                <tr>
                                    <th scope="col" class="text-center">room type</th>
                                    <th scope="col" class="text-center">facilities</th>
                                    <th scope="col" class="text-center">price</th>
                                    <th scope="col" class="text-center">book</th>
                                </tr>
                            </thead>
                            <tbody id="availability-tbody">
                                
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4">
                                        <h5 class="text-pink text-right">total: <span id="total-price"></span></h5>
                                    </td>
                                </tr>
                                <tr id="book-now-row">
                                    <td colspan="4" class="text-right">
                                        <button id="btn-search" onClick="performBook();">book now</button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        </div>
                    </div>

                    <div class="facilities mt-4 mb-4">
                        <h4 class="text-pink">facilities</h4>

                        <div class="row overview" style="width: 100%; margin: 0 auto;">
                        
                        </div>
                    </div>
             
                    <div class="surroundings mt-4 mb-4">
                        <h4 class="text-pink">hotel surroundings</h4>

                        <div class="row" style="margin-left: 0px; margin-right: 0px;">
                            <div class="col-md-6 col-12 p-2">
                                <h4 class="amenity-title"><i class="fas fa-archway"></i> What's nearby</h4>
                                <ul class="hotel-info-ul closest" style="width: 100%; margin: 0 auto;">
                                    
                                </ul>
                            </div>
                            <div class="col-md-6 col-12 p-2">
                                <h4 class="amenity-title"><i class="fas fa-archway"></i> Top attractions</h4>
                                <ul class="hotel-info-ul popular" style="width: 100%; margin: 0 auto;">
                                    
                                </ul>
                            </div>
                        </div>

                        <div class="surroundings-div row" style="width: 100%; margin: 0 auto;">
                        
                        </div>
                    </div>

                    <div class="guest-reviews mt-4 mb-4">
                        <h4 class="text-pink">guest reviews</h4>

                        <div class="row" id="guest-reviews-items">
                            
                        </div>
                    </div>
                </div>
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
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
        
        <!-- SweetAlert -->
        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        
        <!-- Slider -->
        <script src="https://unpkg.com/swiper@7/swiper-bundle.min.js"></script>
        
        <!-- DatePicker -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/litepicker/2.0.11/litepicker.js"></script>
        
        <!-- Google Maps -->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDejsjipkOQWWhjeMzWc0otSPqcNTNkqZs&libraries=&v=weekly&channel=2"></script>

        <!-- Project JavaScript -->
        <script src="./../../shared/js/firebase.js"></script>
        <script src="./email.js"></script>
        <script src="./../../shared/js/classes/Hotel.js"></script>
        <script src="./tmpHotelData.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>