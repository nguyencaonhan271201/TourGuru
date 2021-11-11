<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | My Dashboard</title>
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

        <div class="container-fluid mb-4" style="padding-top: 80px;">
            <div class="main-container">
                <h1 class="text-purple text-center mb-3">my dashboard</h1>
                <ul class="nav nav-tabs d-flex align-items-center justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#" id="nav-flight">flights</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="nav-hotel">hotels</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" id="nav-visited">visited</a>
                    </li>
                </ul>
                <div class="flights-bookings mt-3" style="display: none;">
                    <h3 class="text-pink text-center mb-3">flight bookings</h3>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Iterations</th>
                                <th scope="col">Class</th>
                                <th scope="col">Number of pax</th>
                                <th scope="col">Total price</th>
                                <th scope="col">Booked at</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr>
                                <td>
                                    18 Nov 2021
                                </td>
                                <td>
                                    <div>
                                        <div>
                                            <img src="http://pics.avs.io/50/30/BA.png">
                                            BA551: FCO - LHR (07:30 - 09:30) 
                                        </div>
                                        <div>
                                            <img src="http://pics.avs.io/50/30/AZ.png">
                                            AZ201: LHR - FCO (07:25 - 10:55) 
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    BUSINESS
                                </td>
                                <td>
                                    2
                                </td>
                                <td>
                                    1114.542 EUR
                                </td>
                                <td>
                                    22:12 - 03/11/2021
                                </td>
                                <td>
                                    <a type="button" class="btn btn-info btn-view-booking">View</a>
                                </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <div class="hotels-bookings mt-3" style="display: none;">
                    <h3 class="text-pink text-center mb-3">hotel bookings</h3>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Number of Rooms</th>
                                <th scope="col">Hotel</th>
                                <th scope="col">Total price</th>
                                <th scope="col">Booked at</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr>
                                <td>
                                    18/11/2021 - 20/11/2021
                                    <br>
                                    (2 nights)
                                </td>
                                <td>
                                    2
                                </td>
                                <td>
                                    <div>
                                        <img style="max-height: 100px; max-width: 100px; object-fit: contain;" alt="" src="https://pix10.agoda.net/hotelImages/4880829/228078015/97f70b1331c0e8d7ba87e1b478c8a6ff.jpg?s=1024x768">
                                        <br>
                                        Bulgari Hotel London
                                    </div>
                                </td>
                                <td>
                                    2646.12 EUR
                                </td>
                                <td>
                                    22:12 - 03/11/2021
                                </td>
                                <td>
                                    <a type="button" class="btn btn-info btn-view-booking">View</a>
                                </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <div class="visited-location-div mt-3" style="display: none;">
                    <h3 class="text-pink text-center mb-3">visited attractions</h3>
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
        
        <!-- SweetAlert -->
        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        
        <!-- Material Design -->
        <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
        <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

        <!-- Google Map -->
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBL9TVw2Kc5YxiB1-gLThdttgvhcYP1Mtg&libraries=&v=weekly&channel=2"></script>

        <!-- Project JavaScript -->
        <script src="./../shared/js/firebase.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>