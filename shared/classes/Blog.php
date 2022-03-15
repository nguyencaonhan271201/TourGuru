<?php
class Blog {
  public $conn;
  public $blogs = [];

  public function __construct($conn) {
    $this->setConn($conn);
  }

  public function setConn($conn) {
    $this->conn = $conn;
  }

  public function getCategories(&$errors) {    
    try {
      $query = "SELECT category_id, category_name FROM post_categories";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function getInfo($user_id, $blog_id, &$errors) {    
    try {
      $query = "SELECT * FROM posts WHERE post_id = ? AND author = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("is", $blog_id, $user_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

      if (count($result) == 0) {
        $errors["no_result"] = "No results";
      }
      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function createBlog($content, $title, $category, $description, $user, $plan, $image, &$errors) {
    $cat = ucwords($category);
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
          $dest = "../../shared/assets/images/posts/covers/" . $newFilename;
          if(move_uploaded_file($ftmp, $dest)) {
              //
              $newURL = $dest;
          } else {
              $errors["image"] = "Error occured. Please try again later.";
          }
      }        
    }

    if (!empty($errors)) {
      return;
    }

    //Check if category already exists
    $query = "SELECT * FROM post_categories WHERE category_name = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("s", $cat);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    if (count($result) == 1) {
      $category_id = $result[0]["category_id"];
    } else {
      $query = "INSERT INTO post_categories(category_name) VALUES (?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $cat);
      $stmt->execute();
      
      if ($stmt->affected_rows == 1) {
        $category_id = $stmt->insert_id;
      } else {
        $errors['execute_err'] = "Error occured. Please try again later.";
        return;
      }
    }

    //Add to post table
    if ($image["tmp_name"] != '') {
      if ($plan != null) {
        $query = "INSERT INTO posts(author, category, title, content, description, plan_id, cover) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sisssis", $user, $category_id, $title, $content, $description, $plan, $newURL);
      } else {
        $query = "INSERT INTO posts(author, category, title, content, description, cover) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sissss", $user, $category_id, $title, $content, $description, $newURL);
      }
    } else {
      if ($plan != null) {
        $query = "INSERT INTO posts(author, category, title, content, description, plan_id) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sisssi", $user, $category_id, $title, $content, $description, $plan);
      } else {
        $query = "INSERT INTO posts(author, category, title, content, description) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sisss", $user, $category_id, $title, $content, $description);
      }
    }
    
    $stmt->execute();
    
    if ($stmt->affected_rows == 1) {
      return $stmt->insert_id;
    } else {
      $errors['execute_err'] = "Error occured. Please try again later.";
      return;
    }
  }

  public function editBlog($blogID, $content, $title, $category, $description, $user, $plan, $image, &$errors) {
    $cat = ucwords($category);
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
          $dest = "../../shared/assets/images/posts/covers/" . $newFilename;
          if(move_uploaded_file($ftmp, $dest)) {
              //
              $newURL = $dest;
          } else {
              $errors["image"] = "Error occured. Please try again later.";
          }
      }        
    }

    if (!empty($errors)) {
      return;
    }

    //Check if category already exists
    $query = "SELECT * FROM post_categories WHERE category_name = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("s", $cat);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    if (count($result) == 1) {
      $category_id = $result[0]["category_id"];
    } else {
      $query = "INSERT INTO post_categories(category_name) VALUES (?)";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $cat);
      $stmt->execute();
      
      if ($stmt->affected_rows == 1) {
        $category_id = $stmt->insert_id;
      } else {
        $errors['execute_err'] = "Error occured. Please try again later.";
        return;
      }
    }

    //Add to post table
    if ($image["tmp_name"] != '') {
      if ($plan != null) {
        $query = "UPDATE posts SET author = ?, category = ?, title = ?, content = ?, description = ?, plan_id = ?, cover = ? WHERE post_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sisssisi", $user, $category_id, $title, $content, $description, $plan, $newURL, $blogID);
      } else {
        $query = "UPDATE posts SET author = ?, category = ?, title = ?, content = ?, description = ?, cover = ?, plan_id = NULL WHERE post_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sissssi", $user, $category_id, $title, $content, $description, $newURL, $blogID);
      }
    } else {
      if ($plan != null) {
        $query = "UPDATE posts SET author = ?, category = ?, title = ?, content = ?, description = ?, plan_id = ? WHERE post_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sisssii", $user, $category_id, $title, $content, $description, $plan, $blogID);
      } else {
        $query = "UPDATE posts SET author = ?, category = ?, title = ?, content = ?, description = ?, plan_id = NULL WHERE post_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sisssi", $user, $category_id, $title, $content, $description, $blogID);
      }
    }
    
    $stmt->execute();

    if ($stmt->affected_rows == -1 || $stmt->errno > 0) {
      $errors['execute_err'] = "Error occured. Please try again later.";
      return;
    }
  }
}