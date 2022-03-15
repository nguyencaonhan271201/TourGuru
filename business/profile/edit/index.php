<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru - Business | Edit Profile</title>
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
            include '../../../shared/php/header.php';
        ?>
        <div class="container p-3" style="margin-top: 80px;">
            <div class="main-container">
                <h3 class="text-purple">edit business profile</h3>
                <hr id="main-col-hr">
                <form id="edit-account-form" class="auth-form" method="post" action="index.php" enctype="multipart/form-data">
                    <div class="p-3">
                        <div>
                            <div class="d-flex flex-row justify-content-between">
                                <h5 class="input-label">email</h5>
                                <h5 id="email-invalid" class="invalid-text">invalid</h5>
                            </div>
                            <input type="email" id="email" name="email" class="" disabled>
                        </div>
                        <div class="row">
                            <div class="col-md-6 col-12">
                                <div class="d-flex flex-row justify-content-between">
                                    <h5 class="input-label">business name</h5>
                                    <h5 id="display-name-invalid" class="invalid-text">invalid</h5>
                                </div>
                                <input type="text" id="display-name" name="display-name" class="" required>
                            </div>
                            <div class="col-md-6 col-12">
                                <div class="d-flex flex-row justify-content-between">
                                    <h5 class="input-label">business code</h5>
                                    <h5 id="business-code-invalid" class="invalid-text">invalid</h5>
                                </div>
                                <input type="text" id="business-code" name="business-code" maxlength="10" class="">
                            </div>
                        </div>
                        <div>
                            <div class="d-flex flex-row justify-content-between">
                                <h5 class="input-label">business logo</h5>
                                <h5 id="profile-image-invalid" class="invalid-text">invalid</h5>
                            </div>
                            <div class="text-center">
                                <img src="" alt="" id="profile-img" class="profile-img">
                            </div>
                            <input type="file" accept="image/png, image/jpeg" id="profile-img-input" name="profile-img" class="d-none">
                        </div>
                    </div>
                    <button type="submit" id="btn-edit-account" class="btn-auth-submit"><i class="fas fa-check"></i></button>
                </form>
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