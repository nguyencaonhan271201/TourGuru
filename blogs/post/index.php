<?php 
    session_start();
    $csrf_token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $csrf_token;
?>

<!doctype html>
<html lang="en">
    <head>
        <title>Tour Guru | Blogs | Post</title>
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

        <div class="post-cover">
            <img alt="" src="" id="post-cover-img" class="post-cover-img">
            <div class="abs-block">
              <div class="author d-flex align-items-center justify-content-start">
                <img
                id="author-img" 
                src=""
                alt=""></img>
                <h5 id="post-author-name"></h5>
              </div>
              <h2 id="post-title"></h2>
            </div>
        </div>

        <div class="container-fluid pb-4" style="padding-top: 20px;">
          <div class="main-container">
            <div class="btn-edit d-flex align-items-center justify-content-center"><i class="fas fa-edit"></i></div>
            <h5 class="abs-block-time" id="created">created: </h5>
            <h5 class="abs-block-time" id="updated">updated: </h5>
          </div>
          <div class="description mt-4">
            <h5 id="description"></h5>
          </div>
          <div class="post-content ck ck-content mt-2" id="post-content">
          </div>
          <div class="plans mt-4">
            <h2 class="text-purple">
              check out my plan!
            </h2>
            <iframe
              class="plan-attachment"
              id="plan-attachment"
              src="about:blank" title=""></iframe> 
          </div>

          <hr>
          <div class="pre-comment">
            <div class="categories">
              <p id="category"></p>
            </div>

            <div class="reactions d-flex align-items-center">
              <div class="reaction-select-div">
                <img
                class="reaction-select" 
                data-id="1"
                src="../../shared/assets/images/posts/reactions/1.png"
                alt=""></img><img
                class="reaction-select" 
                data-id="2"
                src="../../shared/assets/images/posts/reactions/2.png"
                alt=""></img><img
                class="reaction-select" 
                data-id="3"
                src="../../shared/assets/images/posts/reactions/3.png"
                alt=""></img><img
                class="reaction-select" 
                data-id="4"
                src="../../shared/assets/images/posts/reactions/4.png"
                alt=""></img><img
                class="reaction-select" 
                data-id="5"
                src="../../shared/assets/images/posts/reactions/5.png"
                alt=""></img><img
                class="reaction-select" 
                data-id="6"
                src="../../shared/assets/images/posts/reactions/6.png"
                alt=""></img><img
                class="reaction-select" 
                data-id="7"
                src="../../shared/assets/images/posts/reactions/7.png"
                alt=""></img>
              </div>
              <div class="reaction-info d-flex align-items-center justify-content-center">
                <p class="m-0 d-inline" id="reaction-count">0</p>
                <img
                class="reaction-top" 
                id="reaction-1"
                src="../../shared/assets/images/posts/reactions/1.png"
                alt=""></img><img
                class="reaction-top" 
                id="reaction-2"
                src="../../shared/assets/images/posts/reactions/2.png"
                alt=""></img><img
                id="reaction-3"
                class="reaction-top" 
                src="../../shared/assets/images/posts/reactions/3.png"
                alt=""></img>
              </div>
              <i id="reaction-selection" class="far fa-thumbs-up"></i>
            </div>
          </div>

          

          <div class="comment-div">
            <h2 class="text-purple">
              comments
            </h2>
            <div class="comment-input-div">
              <div class="comment-input-div-inline">
                <a><img
                  class="commentor-img" 
                  id="comment-input-author-img"
                  src=""
                  alt=""></img></a>
                <input type="text" id="comment" placeholder="write comment...">
              </div>
            </div>
            <div id="comments-list">
              
              
            </div>
          </div>
        </div>

        <div class="backdrop">
          <div class="reaction-details">
            <ul class="reaction-type">
              <!-- <li class="reaction-item" data-type="0">Tất cả</li>
              <li class="reaction-item reaction-item-selected-yellow" data-type="1"><img
                class="reaction-top" 
                id="reaction-1"
                src="../../shared/assets/images/posts/reactions/1.png"
                alt=""></img> 
                <span class="font-weight-bold ml-1" style="color: red">abc</span>
              </li> -->
            </ul>
            <div id="reaction-list">
              <div class="reaction-list-item">
               
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
        
        <!-- SweetAlert -->
        <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        
        <!-- DatePicker -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/litepicker/2.0.11/litepicker.js"></script>
        
        <!-- Material Design -->
        <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
        <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

        <!-- CKEditor CDN -->
        <script src="https://cdn.ckeditor.com/ckeditor5/32.0.0/classic/ckeditor.js"></script>

        <!-- Infinite scroll -->
        <script src="https://unpkg.com/infinite-scroll@4/dist/infinite-scroll.pkgd.min.js"></script>

        <!-- Project JavaScript -->
        <script src="./../../shared/js/firebase.js"></script>
        <script src="./main.js"></script>
    </body>
</html>

<?php ?>