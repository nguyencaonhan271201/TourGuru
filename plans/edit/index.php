<?php 
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Edit Plan</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="../../shared/css/tooltip.css">
    </head>
    <body>
        <div class="container-fluid mt-4 mb-4">
            <div class="main-container">
                <div class="btn-block text-right">
                    <button type="button" id="btn-save"><i class="fas fa-save"></i></button>
                </div>
                <div class="header-div text-center">
                    <div class="editable-container" id="title-div">
                        <h1 id="plan-title">title</h1>
                        <p class="editable-icon" data-type="title"><i class="fas fa-edit"></i></p>
                    </div>
                    <div class="editable-container" id="date-div">
                        <h4 id="plan-date">from date - to date</h4>
                        <p class="editable-icon" data-type="date"><i class="fas fa-edit"></i></p>
                    </div>
                    <div class="editable-container" id="description-div">
                        <h5 class="editable" id="plan-description"></h5>
                        <p class="editable-icon" data-type="description"><i class="fas fa-edit"></i></p>
                    </div>
                    <p class="editable-icon-show" id="add-description"
                    data-tooltip="Add description" data-tooltip-location="right"
                    ><i class="fa fa-plus" aria-hidden="true"></i></p>
                    <div class="">
                        <p class="text-gray text-right font-italic" id="plan-created">created: </p>
                    </div>
                </div>
                <hr>
                <div class="external-linkings">
                    <h2 class="text-pink text-right">bookings</h2>
                    <div class="bookings">
                        
                    </div>
                    <p class="editable-icon-show mt-3" id="add-booking"
                    data-tooltip="Link an existing booking" data-tooltip-location="right"
                    ><i class="fa fa-plus" aria-hidden="true"></i></p>
                </div>
                <hr>
                <div class="main-detail-div text-center">
                    <h2 class="text-pink text-right">details</h2>
                    <div id="details">

                    </div>
                    <p class="editable-icon-show" id="add-detail"
                    data-tooltip="Add a detail" data-tooltip-location="right"><i class="fa fa-plus" aria-hidden="true"></i></p>
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

        <!-- Project JavaScript -->
        <script src="./../../shared/js/firebase.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>