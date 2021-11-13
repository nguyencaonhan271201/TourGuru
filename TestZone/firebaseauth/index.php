<?php

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id="btn-login">Login With Google</button>
    <button id="btn-logout">Logout</button>
    <p id="username"></p>
    <p id="email"></p>

    <input type="email" id="inp-email"></input>
    <input type="password" id="password"></input>
    <button id="btn-register">Register</button>
    <button id="btn-login-email">Login</button>
    <button id="btn-logout-email">Logout</button>

    <img id="img-user">

    <!-- Firebase Authentication -->
    <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-auth-compat.js"></script>

    <script type="text/javascript" src="main.js"></script>
</body>
</html>

<?php

?>