<?php
class User {
    public $email;
    public $password;
    public $display_name;
    public $date_created;
    public $profile_image;
    public $users = [];
    public $conn;

    public function __construct($conn) {
        $this->setConn($conn);
    }

    public function setConn($conn) {
        $this->conn = $conn;
    }

    public function providerSignUp($id, $email, $displayName, $image, &$errors) {
        try {
            $query = "INSERT INTO users(user_id, mail, display_name, image) VALUES (?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("ssss", $id, $email, $displayName, $image);
            $stmt->execute();
            if ($stmt->affected_rows == 1) {
                return;
            } else {
                $errors['execute_err'] = "Server error.";
            } 
        } catch (Exception $e) {
            $errors['execute_err'] = "Server error.";
            return;
        }
    }

    public function localSignUp($id, $email, $password, &$errors) {
        try {
            //Hash password
            $hash = password_hash($password, PASSWORD_DEFAULT);

            $query = "INSERT INTO users(user_id, mail, password) VALUES (?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("sss", $id, $email, $hash);
            $stmt->execute();
            if ($stmt->affected_rows == 1) {
                return;
            } else {
                $errors['execute_err'] = "Server error.";
            } 
        } catch (Exception $e) {
            $errors['execute_err'] = "Server error.";
            return;
        }
    }

    public function getProfileInfo($id) {
        try {
            $query = "SELECT mail, display_name, image FROM users WHERE user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            return $result;
        } catch (Exception $e) {
            return [];
        }
    }

    public function editProfile($id, $displayName, $image, &$errors) {
        $newURL = "";

        if ($image["tmp_name"] != '') {
            $fname = $image['name'];
            $ftype = $image['type'];
            $ftmp = $image['tmp_name'];
            $ferr = $image['error'];
            $fsize = $image['size'];
            $allowed_ext = ['png', 'jpg', 'jpeg', '.bmp', '.PNG', '.JPG', '.JPEG', '.BMP'];

            //Check if there are errors on upload
            if ($ferr != 0) {
                $errors["image"] = "File error.";
                $profileErr = true;
            }

            //Check file type and extension
            $ftype = explode("/", $ftype);
            if ($ftype[0] != 'image' || !in_array(end($ftype), $allowed_ext)) {
                $errors["image"] = "Images only.";
                $profileErr = true;
            }

            //Check file size
            if ($fsize > 5242880) {
                $errors["image"] = "File is too large.";
                $profileErr = true;
            }

            //Error by upload constraints of server
            if ($image['error'] == 1) {
                $errors["image"] = "Upload error.";
                $profileErr = true;
            }

            if (!isset($profileErr)) {
                $newFilename = uniqid('', true) . "." . end($ftype);
                $dest = "../../shared/assets/images/users" . $newFilename;
                if(move_uploaded_file($ftmp, $dest)) {
                    //
                    $newURL = $dest;
                } else {
                    $errors["image"] = "Error occured. Please try again later.";
                }
            }        
        }

        if (empty($errors)) {
            //Check info
            if ($displayName == "" || !filter_var($displayName, FILTER_SANITIZE_STRING)) {
                $errors["displayName"] = "Display name is not valid.";
                return;
            }
            
            if ($image["tmp_name"] != '') {
                $query = "UPDATE users SET display_name = ?, image = ? WHERE user_id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("sss", htmlspecialchars($displayName), $newURL, $id);
                $stmt->execute();
            } else {
                $query = "UPDATE users SET display_name = ? WHERE user_id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("ss", htmlspecialchars($displayName), $id);
                $stmt->execute();
            }
            if ($stmt->affected_rows == -1 || $stmt->errno > 0) {
                $errors['server_error'] = "Server error. Please try again later!";
            }
        }
    }
}