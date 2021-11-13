<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Hotels</title>
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
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/1.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/8.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/7.jpeg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/3.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/5.png" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/2.webp" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/6.jpg" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/4.webp" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/9.png" alt="">
                    </div>
                    <div class="carousel-item">
                        <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/10.jpg" alt="">
                    </div>
                </div>
            </div>

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
                            <div id="hotel-search-div" class="col-md-4 col-sm-12 d-flex p-0  mb-sm-2">
                                <div class="input-block input-block-abs">
                                    <span class="d-flex align-items-center header-search">
                                        <i class="fa fa-map-marker-alt ml-2 mr-2" aria-hidden="true"></i>
                                        <input type="text" name="location" id="location" placeholder="location"></input>
                                    </span>
                                    <div id="search-location-result" class="header-search-result">

                                    </div>
                                </div>
                            </div>
                            <div id="date-search-div" class="col-md-6 col-sm-12 d-flex p-0 mb-sm-2">
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
                            <div class="col-md-2 col-sm-12 d-flex p-0">
                                <div class="input-block btn-search-block">
                                    <button id="btn-search">
                                        <i class="fa fa-search mr-1" aria-hidden="true"></i>Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="container search-result-div mt-4" style="opacity: 0">
                <div class="row">
                    <div class="col-md-4 col-sm-12 summary-box">
                    <h5 class="mb-3 text-purple">stars</h5>
                        <hr class="overlap-hr">
                        <div class="mt-2 mb-2">
                            <input class="star-checkbox" type="checkbox" data-star=1>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                        </div>
                        <div class="mt-2 mb-2">
                            <input class="star-checkbox" type="checkbox" data-star=2>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                        </div>
                        <div class="mt-2 mb-2">
                            <input class="star-checkbox" type="checkbox" data-star=3>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                        </div>
                        <div class="mt-2 mb-2">
                            <input class="star-checkbox" type="checkbox" data-star=4>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                        </div>
                        <div class="mt-2 mb-2">
                            <input class="star-checkbox" type="checkbox" data-star=5>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                            <i class="fa fa-star filter-star" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="col-md-8 col-sm-12 pl-4">
                        <div id="result-div">
                            <h2 id="location-title-h2" class="mt-1"></h2>

                            <div class="text-right d-flex align-items-center justify-content-start">
                                <h5 class="mr-2 mb-1 mt-0" style="color: black !important;">sort by: </h5>
                                <select name="sort" id="sort">
                                    <option value="BEST_SELLER" selected="selected">best seller</option>
                                    <option value="STAR_RATING_HIGHEST_FIRST">stars (high to low)</option>
                                    <option value="STAR_RATING_LOWEST_FIRST">stars (low to high)</option>
                                    <option value="DISTANCE_FROM_LANDMARK">distance from landmark</option>
                                    <option value="GUEST_RATING">guest rating</option>
                                    <option value="PRICE_HIGHEST_FIRST">price (highest first)</option>
                                    <option value="PRICE">price (lowest first)</option>
                                </select>
                            </div>
                            <div id="result-choices">
                                
                            </div>

                            <nav aria-label="" id="hotel-pagination">
                                <ul class="pagination">
                                    <li class="page-item active"><a class="page-link" href="javascript:pageChange(1)">1</a></li>
                                    <li class="page-item"><a class="page-link" href="javascript:pageChange(2)">2</a></li>
                                    <li class="page-item"><a class="page-link" href="javascript:pageChange(3)">3</a></li>
                                    <li class="page-item"><a class="page-link" href="javascript:pageChange(4)">4</a></li>
                                    <li class="page-item"><a class="page-link" href="javascript:pageChange(5)">5</a></li>
                                </ul>
                            </nav>
                        </div>
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
        <script src="./../shared/js/classes/Hotel.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>