<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru - Business | Sign Up</title>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Icon -->
        <link rel="icon" href="../../shared/assets/images/logo.svg">

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css">

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        
        <div class="container-fluid">
            <div class="row">
                <div class="align-items-center justify-content-center col-md-6 col-sm-0 d-md-flex d-none" id="sign-in-left-col"> 
                    <img class="left-col-logo w-100 h-100" alt="" src="login.svg">
                </div>

                <div class="col-md-6 col-sm-0" id="sign-in-main-col"> 
                    <div class="container">
                        <div class="main-col-above text-md-left p-2 text-sm-center">
                            <h3 class="text-purple">sign up - business</h3>
                            <p class="mb-1"><span class="text-lighter">already have an account? 
                                <a href="./login.php" class="text-dark-purple a-dark-purple">sign in</a> 
                            </span> </p>
                            <!-- <button class="btn btn-google d-flex align-items-center justify-content-center" id="btn-google">
                                <img src = "./../shared/assets/images/google_logo.svg" alt="" id="img-google-logo" class="mr-2"/>
                                continue with Google
                            </button> -->
                        </div>
                        <hr id="main-col-hr">
                        <div class="main-col-below">
                            <form id="sign-up-form" class="auth-form" method="post" action="index.php">
                                <div class="p-3">
                                    <div class="row">
                                        <div class="col-md-6 col-12">
                                            <div class="d-flex flex-row justify-content-between">
                                                <h5 class="input-label">business name</h5>
                                                <h5 id="name-invalid" class="invalid-text">invalid</h5>
                                            </div>
                                            <input type="text" id="sign-up-business" name="sign-up-business" class="" required>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="d-flex flex-row justify-content-between">
                                                <h5 class="input-label">business type</h5>
                                                <h5 id="business-type-invalid" class="invalid-text">invalid</h5>
                                            </div>
                                            <select type="email" id="sign-up-business-type" name="sign-up-business-type" class="" required>
                                                <option value="0">airline</option>
                                                <option value="1">hotel</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="d-flex flex-row justify-content-between">
                                            <h5 class="input-label">email</h5>
                                            <h5 id="email-invalid" class="invalid-text">invalid</h5>
                                        </div>
                                        <input type="email" id="sign-up-email" name="sign-up-email" class="" required>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 col-12">
                                            <div class="d-flex flex-row justify-content-between">
                                                <h5 class="input-label">password</h5>
                                            </div>
                                            <input type="password" id="sign-up-password" name="sign-up-password" class="" required>
                                            <h5 id="password-invalid" class="invalid-text">invalid</h5>
                                        </div>
                                        <div class="col-md-6 col-12">
                                            <div class="d-flex flex-row justify-content-between">
                                                <h5 class="input-label">confirm</h5>
                                            </div>
                                            <input type="password" id="sign-up-confirm-password" name="sign-up-confirm-password" class="" required>
                                            <h5 id="confirm-password-invalid" class="invalid-text">invalid</h5>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" id="btn-sign-up-submit" class="btn-auth-submit"><i class="fas fa-arrow-right"></i></button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Loading modal -->
        <div class="modal" id="sign-up-loading-modal" 
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
        <div class="modal fade" id="sign-up-error-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
        <p id="csrf-sign-up" style="display: none"><?php echo $_SESSION['csrf']; ?></p>

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
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>