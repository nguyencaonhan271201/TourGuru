<?php
class validate{
     public static function validateProfileInput($POST, &$errors, $conn, $checkDuplicate = true) {
        $username = $POST['username'];
        $display = $POST['display'];
        $email = $POST['email'];

        $password1 = $POST['password1'];
        $password2 = $POST['password2'];
        
        //Check username
        if (strlen($username) < 6) {
            $errors["username"] = "Username must be at least 6 characters.";
        }

        //Check display name
        if (strlen(trim($display)) == 0 || !filter_var($display, FILTER_SANITIZE_STRING)) {
            $errors["display"] = "Display name is not valid.";
        }

        //Check email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors["email"] = "Email is not valid.";
        }

        //Check password if password has value
        if (strlen($password1) < 6) {
            $errors["password1"] = "Password length must be at least 6 characters.";
        } else if ($password2 != $password1) {
            $errors["password2"] = "Password confirmation is wrong.";
        } else if (!filter_var($password1, FILTER_SANITIZE_STRING)) {
            $errors["password1"] = "Password is invalid.";
        }

        if (!isset($_POST['dob']) || $_POST['dob'] == null) {
            $errors["dob"] = "Date of birth is invalid.";
        }

        if (!isset($_POST['gender']) || !in_array($_POST['gender'], ['male', 'female'])) {
            $errors["gender"] = "Gender is invalid.";
        }
    }

    public static function validateProfileEdit($POST, &$errors, $conn) {
        $display= $POST['display'];
        $email = $POST['email'];
        $dob = $POST['dob'];
        $gender = $POST['gender'];
        $description = $POST['description'];
        
        //Check display name
        if (strlen(trim($display)) == 0 || !filter_var($display, FILTER_SANITIZE_STRING)) {
            $errors["display"] = "Display name is not valid.";
        }

        //Check email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors["email"] = "Email is not valid.";
        }

        //Check gender
        if (!isset($_POST['gender']) || !in_array($_POST['gender'], ['male', 'female'])) {
            $errors["dob"] = "Gender is invalid.";
        }

        //Check description
        if (strlen(trim($description)) >= 255 || !filter_var($description, FILTER_SANITIZE_STRING)) {
            $errors["description"] = "Description is not valid.";
        }
    }

    public static function validateProfileImage($FILES, &$errors, $type) {
        switch ($type) {
            case 0:
                $file = $FILES['profile-image'];
                $string = "profile-image";
                break;
            case 1:
                $file = $FILES['cover-image'];
                $string = "cover-image";
                break;
        }


        $fname = $file['name'];
        $ftype = $file['type'];
        $ftmp = $file['tmp_name'];
        $ferr = $file['error'];
        $fsize = $file['size'];
        $allowed_ext = ['png', 'jpg', 'jpeg', '.bmp', '.PNG', '.JPG', '.JPEG', '.BMP'];

        //Check if there are errors on upload
        if ($ferr != 0) {
            $errors[$string] = "File error.";
            $profileErr = true;
        }

        //Check file type and extension
        $ftype = explode("/", $ftype);
        if ($ftype[0] != 'image' || !in_array(end($ftype), $allowed_ext)) {
            $errors[$string] = "Images only.";
            $profileErr = true;
        }

        //Check file size
        if ($fsize > 5242880) {
            $errors[$string] = "File is too large.";
            $profileErr = true;
        }

        //Error by upload constraints of server
        if ($file['error'] == 1) {
            $errors[$string] = "Upload error.";
            $profileErr = true;
        }

        if (!isset($profileErr)) {
            $newFilename = uniqid('', true) . "." . end($ftype);
            $get_folder = explode("-", $string);
            $dest = "assets/images/{$get_folder[0]}/" . $newFilename;
            if(move_uploaded_file($ftmp, $dest)) {
                return $dest;
            }
        }        
    }

    public static function validateImageMessage($file) {
        $fname = $file['name'];
        $ftype = $file['type'];
        $ftmp = $file['tmp_name'];
        $ferr = $file['error'];
        $fsize = $file['size'];
        $allowed_ext = ['png', 'jpg', 'jpeg', '.bmp', '.PNG', '.JPG', '.JPEG', '.BMP'];
        if ($ferr != 0) {
            echo json_encode(false);
            return;
        }

        //Check file type and extension
        $ftype = explode("/", $ftype);
        if ($ftype[0] != 'image' || !in_array(end($ftype), $allowed_ext)) {
            echo json_encode(false);
            return;
        }

        //Check file size
        if ($fsize > 5242880) {
            echo json_encode(false);
            return;
        }

        //Passed all the test
        $newFilename = uniqid('', true) . "." . end($ftype);
        $dest = "./../../assets/images/messages/" . $newFilename;
        if(move_uploaded_file($ftmp, $dest)) {
            echo $dest;
        }
    }
}
?>