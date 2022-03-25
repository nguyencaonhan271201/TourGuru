<?php
class Business {
    public $email;
    public $password;
    public $business_name;
    public $image;
    public $businesses = [];
    public $conn;

    public function __construct($conn) {
        $this->setConn($conn);
    }

    public function setConn($conn) {
        $this->conn = $conn;
    }

    public function localSignUp($id, $email, $password, $business_name, $business_type, &$errors) {
        try {
            //Hash password
            $hash = password_hash($password, PASSWORD_DEFAULT);

            $query = "INSERT INTO businesses(biz_user_id, mail, password, business_type, business_name) VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("sssis", $id, $email, $hash, $business_type, $business_name);
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
            $query = "SELECT business_name, business_code, business_type, mail, image FROM businesses WHERE biz_user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            return $result;
        } catch (Exception $e) {
            return [];
        }
    }

    public function getHeaderInfo($id) {
        try {
            $query = "SELECT business_name, business_code, business_type, image FROM businesses WHERE biz_user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            return $result;
        } catch (Exception $e) {
            return [];
        }
    }

    public function editProfile($id, $displayName, $businessCode, $businessType, $image, &$errors) {
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
                $dest = "../../../shared/assets/images/businesses/" . $newFilename;
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
                $errors["displayName"] = "Business name is not valid.";
                return;
            }

            if ($businessCode && !filter_var($businessCode, FILTER_SANITIZE_STRING)) {
                $errors["businessCode"] = "Business code is not valid.";
                return;
            }

            $filter_name = htmlspecialchars($displayName);
            $filter_code = htmlspecialchars($businessCode);
            
            if ($image["tmp_name"] != '') {
                $query = "UPDATE businesses SET business_name = ?, business_code = ?, business_type = ?, image = ? WHERE biz_user_id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("ssiss", $filter_name, $filter_code, $businessType, $newURL, $id);
                $stmt->execute();
            } else {
                $query = "UPDATE businesses SET business_name = ?, business_code = ?, business_type = ? WHERE biz_user_id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->bind_param("ssis", $filter_name, $filter_code, $businessType, $id);
                $stmt->execute();
            }
            if ($stmt->affected_rows == -1 || $stmt->errno > 0) {
                $errors['server_error'] = "Server error. Please try again later!";
            }
        }
    }
}