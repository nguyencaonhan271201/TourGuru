<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Create Plan</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="../../shared/css/tooltip.css">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?php 
            include '../../shared/php/header.php';
        ?>

        <div class="container-fluid mb-4" style="padding-top: 80px;">
            <div class="main-container">
                <!-- <div class="btn-block text-right">
                    <button type="button" id="btn-save"><i class="fas fa-save"></i></button>
                    <button type="button" id="btn-print"><i class="fa fa-print" aria-hidden="true"></i></button>
                </div> -->
                <p class="text-gray text-caution text-center">
                    you should submit your plan whenever the basic information is included. <br>further modifications are allowed.
                </p>
                <div class="text-center">
                    <button type="button" id="btn-create" class="text-center mr-1"><i class="fas fa-save"></i></button>
                    <!-- <button type="button" id="btn-add-colab" class="text-center ml-1"><i class="fas fa-plus"></i></button> -->
                </div>
                <div class="header-div text-center">
                    <div class="editable-container" id="title-div">
                        <div class="flex-row d-flex align-items-center justify-content-center">
                            <h1 id="plan-title">title
                           
                            </h1>
                            <span id="plan-mode" class="ml-2">
                                <i class="fas fa-lock"></i>
                            </span>
                        </div>
                        <p class="editable-icon" data-type="title"><i class="fas fa-edit"></i></p>

                    </div>

                    <div class="editable-container" id="colab-div">
                        <div class="colabs mt-2" id="colabs-display" onClick="showAddColabSwal()">
                            
                        </div>
                    </div>

                    <div class="editable-container mt-2 mb-2 d-flex flex-row align-items-center justify-content-center" id="wrapper-location-div">
                        <!-- <p class="mb-1 mr-2">locations: </p> -->
                        <div id="wrapper-locations-display">
                        
                        </div>
                        <p class="editable-icon wrapper-location-editable"
                        data-tooltip="Add a location" data-tooltip-location="right"
                        data-type="wrapper-location"><i class="fas fa-plus"></i></p>
                    </div>
                    
                    <!-- <div class="editable-container" id="date-div">
                        <h4 class="editable" id="plan-date">from date - to date</h4>
                        <p class="editable-icon" data-type="date"><i class="fas fa-edit"></i></p>
                    </div> -->
                    <!-- <div class="editable-container mb-2 mt-2" id="mode-div">
                        <span id="plan-mode">
                            <i class="fas fa-globe-asia"></i>
                            <i class="fas fa-lock"></i> private
                        </span>
                        <p class="editable-icon" data-type="mode"><i class="fas fa-edit"></i></p>
                    </div> -->

                    <div class="editable-container" id="description-div">
                        <!-- <h5 class="editable" id="plan-description"></h5>
                        <p class="editable-icon"><i class="fas fa-edit"></i></p> -->

                        <p class="editable-icon-show" id="add-description"
                    data-tooltip="Add description" data-tooltip-location="left"
                    ><i class="fa fa-plus" aria-hidden="true"></i></p>
                    </div>
                    

                </div>

                <div class="main-detail-div text-center">
                    <h2 class="text-purple text-left" style="font-family: 'body'">plans
                       
                    </h2>

                    <p class="editable-icon-show mt-3" id="add-day"
                        data-tooltip="Add a day" data-tooltip-location="right"><i class="fa fa-plus" aria-hidden="true"></i></p>
                        
                    <div id="details" class="row">

                    </div>
                </div>

                <div class="external-linkings">
                    <h2 class="text-purple text-left" style="font-family: 'body'">bookings</h2>
                    <div class="bookings">
                        <div class="flight-bookings row">

                        </div>
                        <div class="hotel-bookings row">

                        </div>
                    </div>

                    <p class="editable-icon-show mt-3" id="add-booking"
                    data-tooltip="Link an existing booking" data-tooltip-location="right"
                    ><i class="fa fa-plus" aria-hidden="true"></i></p>
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
        
        <!-- DatePicker -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/litepicker/2.0.11/litepicker.js"></script>
        
        <!-- Material Design -->
        <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
        <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

        <!-- SortableJS (for Draggable list) -->
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>

        <!-- Project JavaScript -->
        <script src="./../../shared/js/firebase.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>