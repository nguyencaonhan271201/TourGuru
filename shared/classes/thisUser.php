<?php
class thisUser extends User{
    public function checkSignIn($POST, &$errors) {
        $username = $POST['username'];
        $password = $POST['password'];

        //Check username
        if ($username == "") {
            $errors["username"] = "This field cannot be empty.";
        }

        //Check password
        if ($password == "") {
            $errors["password"] = "This field cannot be empty.";
        }

        //Pass all the tests
        if (empty($errors)) {
            $query = "SELECT ID, email, password FROM users WHERE email = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $results = $stmt->get_result();
            //Check
            if ($results->num_rows == 0) {
                $errors["execute_err"] = "Sign in information is not correct";
            } else {
                $row = $results->fetch_assoc();
                //Valid sign in information
                if (!password_verify($password, $row['password'])) {
                    $errors["wrong_pass"] = "Password is not correct.";
                    http_response_code(400);
                } else {
                    $this->id = $row['ID'];
                    http_response_code(200);
                }
            }
        }
    }

    public function registerUser($hash, $display, $email, $dob, $gender, &$errors) {
        $query = "INSERT INTO users(email, password) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $email, $hash);
        $stmt->execute();
        if ($stmt->affected_rows == 1) {
            $get_id = $stmt->insert_id;
            $query = "INSERT INTO users(ID, display_name, email) VALUES (?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("iss", $get_id, $display, $email, $dob, $gender);
            $stmt->execute();
            if ($stmt->affected_rows == 1) {
                $this->id = $get_id;
                
            } else {
                // $query = "DELETE FROM profiles WHERE ID = ?";
                // $stmt = $this->conn->prepare($query);
                // $stmt->bind_param("i", $get_id);
                // $stmt->execute();
                // $errors['execute_err'] = "Server error. Please try again later!";
            }
        } else {
            // $errors['execute_err'] = "Server error. Please try again later!";
        } 
    }

    
    public function checkRegisterUser($POST, $FILE, &$errors) {
        Validate::validateProfileInput($POST, $errors, $this->conn, true);
        
        //Check for users with same username
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $_POST['username']);
        $stmt->execute(); 
        if ($stmt->get_result()->num_rows > 0) {
            $errors["execute_err"] = "Username already exists. Try again with a different one.";
        }

        //Passed all the tests
        if (empty($errors)) {
            //Everything is good. Register user
            $username = $POST['username'];
            $display = $POST['display'];
            $email = $POST['email'];
            $password1 = $POST['password1'];
            $hash = password_hash($password1, PASSWORD_DEFAULT);

            //$this->registerUser($username, $hash, $display, $email, $gender, $errors);
        }
    }
}
?>