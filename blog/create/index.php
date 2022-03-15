<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Blog | Create Post</title>
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

        <div class="post-cover"  data-tooltip="Click to change post cover" data-tooltip-location="bottom">
            <img alt="" src="../../shared/assets/images/posts/covers/default.jpg" id="post-cover-img" class="post-cover-img">
            <h1>create a post</h1>
            <input type="file" accept="image/png, image/jpeg" id="post-cover-img-input" name="post-cover-img" class="d-none">
        </div>

        <div class="container-fluid pb-4" style="padding-top: 40px;">
            <div class="main-container">
                <form id="create-post-form" method="post" action="index.php">
                    <div class="row mb-3">
                        <div class="col-lg-6 col-12">
                            <div class="form-item">
                                <h3 class="form-label text-purple">title</h3>
                                <input type="text" class="form-control" name="title" id="title" required>
                            </div>
                        </div>
                        <div class="col-lg-6 col-12">
                            <div class="form-item" id="category-block">
                                <h3 class="form-label text-purple">category</h3>
                                <input id="category" type="text" class="form-control" name="category" required>
                                <div id="category-result">
                                    <div class="result">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-item mb-3">
                        <h3 class="form-label text-purple">link a plan</h3>
                        <select class="form-control" name="plan" id="plan">

                        </select>
                    </div>
                    <div class="form-item mb-3">
                        <h3 class="form-label text-purple">description</h3>
                        <textarea class="form-control" name="description" id="description" rows="4"></textarea>
                    </div>
                    <div class="form-item mb-3">
                        <h3 class="form-label text-purple">post details</h3>
                        <div id="detail" name="detail">

                        </div>
                    </div>
                    <div class="text-left">
                        <button type="submit" id="btn-create" class="text-center mr-1">create post</button>
                    </div>
                </form>
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

        <!-- Image upload adapter for image -->
        <script src="./TourGuruUploadAdapter.js"></script>

        <!-- CKEditor CDN -->
        <script src="https://cdn.ckeditor.com/ckeditor5/32.0.0/classic/ckeditor.js"></script>

        <!-- Project JavaScript -->
        <script src="./../../shared/js/firebase.js"></script>
        <script src="./main.js"></script>
    </body>
</html>