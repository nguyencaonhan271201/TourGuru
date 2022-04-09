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

  public function getPublicInfo($blog_id, &$errors) {    
    try {
      $query = "SELECT *, (SELECT mail FROM users u WHERE u.user_id = posts.author) AS author_email,
      (SELECT image FROM users u WHERE u.user_id = posts.author) AS author_image,
      (SELECT display_name FROM users u WHERE u.user_id = posts.author) AS author_name,
      (SELECT category_name FROM post_categories p WHERE p.category_id = posts.category) AS category_name
      FROM posts WHERE post_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $blog_id);
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

  public function getReactions($blog_id, &$errors) {    
    try {
      $query = "SELECT * FROM post_reactions WHERE post_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $blog_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function getReactionDetails($blog_id, &$errors) {    
    try {
      $query = "SELECT *,
      (SELECT u.mail FROM users u WHERE u.user_id = p1.user_id) AS email,
      (SELECT u.display_name FROM users u WHERE u.user_id = p1.user_id) AS display_name,
      (SELECT u.image FROM users u WHERE u.user_id = p1.user_id) AS image
      FROM post_reactions p1 WHERE post_id = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $blog_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function updateReaction($uid, $blogID, $type, $reaction, &$errors) {    
    try {
      if ($type == 0) {
        //Insert new reaction
        $query = "INSERT INTO post_reactions(post_id, user_id, reaction_type) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("isi", $blogID, $uid, $reaction);
      } else if ($type == 1) {
        //Update reaction
        $query = "UPDATE post_reactions SET reaction_type = ? WHERE post_id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iis", $reaction, $blogID, $uid);
      } else {
        //Cancel reaction
        $query = "DELETE FROM post_reactions WHERE post_id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $blogID, $uid);
      }
      
      $stmt->execute();

      if ($stmt->affected_rows == -1 || $stmt->errno > 0){
        $errors["execute_err"] = "Error occurred!!!";
      }

    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured!!!";
      return;
    }
  }

  public function updateComment($uid, $blogID, $type, $comment, $childOf, $originalID, &$errors) {    
    try {
      if ($type == 0) {
        if ($childOf != null) {
          $query = "INSERT INTO post_comments(post_id, author, content, child_of) VALUES (?, ?, ?, ?)";
          $stmt = $this->conn->prepare($query);
          $stmt->bind_param("issi", $blogID, $uid, $comment, $childOf);
        } else {
          $query = "INSERT INTO post_comments(post_id, author, content) VALUES (?, ?, ?)";
          $stmt = $this->conn->prepare($query);
          $stmt->bind_param("iss", $blogID, $uid, $comment);
        }
      } else if ($type == 1) {
        //Update comment
        $originalID = intval($originalID);
        $query = "UPDATE post_comments SET content = ? WHERE author = ? AND comment_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $comment, $uid, $originalID);
      } else {
        //Delete comment
        $originalID = intval($originalID);
        $query = "DELETE FROM post_comments WHERE comment_id = ? AND author = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("is", $originalID, $uid);
      }
      
      $stmt->execute();

      if ($stmt->affected_rows == -1 || $stmt->errno > 0){
        $errors["execute_err"] = "Error occurred!!!";
      } else {
        if (isset($stmt->insert_id)) {
          return $stmt->insert_id;
        }
      }
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured!!!";
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
        $query = "UPDATE posts SET author = ?, category = ?, title = ?, content = ?, description = ?, plan_id = ?, cover = ?, date_updated = NOW() WHERE post_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sisssisi", $user, $category_id, $title, $content, $description, $plan, $newURL, $blogID);
      } else {
        $query = "UPDATE posts SET author = ?, category = ?, title = ?, content = ?, description = ?, cover = ?, plan_id = NULL, date_updated = NOW() WHERE post_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sissssi", $user, $category_id, $title, $content, $description, $newURL, $blogID);
      }
    } else {
      if ($plan != null) {
        $query = "UPDATE posts SET author = ?, category = ?, title = ?, content = ?, description = ?, plan_id = ?, date_updated = NOW() WHERE post_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sisssii", $user, $category_id, $title, $content, $description, $plan, $blogID);
      } else {
        $query = "UPDATE posts SET author = ?, category = ?, title = ?, content = ?, description = ?, plan_id, date_updated = NOW() = NULL WHERE post_id = ?";
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

  public function deleteBlog($blogID, $user, &$errors) {
    $sql = "DELETE FROM posts WHERE author = ? AND post_id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("si", $user, $blogID);
    $stmt->execute();
    if ($stmt->affected_rows != 1){
      $errors["server_err"] = "Error occurred!!!";
    }
  }

  public function getComments($blog_id, &$errors) {    
    try {
      $query = "SELECT *,
      (SELECT u.mail FROM users u WHERE u.user_id = p1.author) AS email,
      (SELECT u.display_name FROM users u WHERE u.user_id = p1.author) AS display_name,
      (SELECT u.image FROM users u WHERE u.user_id = p1.author) AS image
      FROM post_comments p1 WHERE post_id = ? ORDER BY date_created ASC";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $blog_id);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function findPostsByAuthor($author, &$errors) {    
    try {
      $query = "SELECT *,
      (SELECT display_name FROM users u WHERE p.author = u.user_id) AS display_name,
      (SELECT mail FROM users u WHERE p.author = u.user_id) AS email,
      (SELECT image FROM users u WHERE p.author = u.user_id) AS image
      FROM posts p WHERE author = ?
      ORDER BY date_created DESC";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $author);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      
      if (count($result) > 0)
      {
        array_unshift($result, 1);
        return $result;
      }

      else {
        $query = "SELECT * FROM users WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $author);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows == 0){
          $errors["execute_err"] = "Error occured";
          return;
        }
        
        $result = $result->fetch_all(MYSQLI_ASSOC);
        array_unshift($result, 0);
        return $result;
      }

    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function findPostsByCategory($category, &$errors) {    
    try {
      $query = "SELECT *,
      (SELECT display_name FROM users u WHERE p.author = u.user_id) AS display_name,
      (SELECT mail FROM users u WHERE p.author = u.user_id) AS email,
      (SELECT image FROM users u WHERE p.author = u.user_id) AS image,
      (SELECT category_name FROM post_categories pc WHERE pc.category_id = p.category) AS category_name
      FROM posts p WHERE category = ?
      ORDER BY date_created DESC";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("i", $category);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      
      if (count($result) > 0)
      {
        array_unshift($result, 1);
        return $result;
      }
      else {
        $query = "SELECT * FROM post_categories WHERE category_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $category);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows == 0){
          $errors["execute_err"] = "Error occured";
          return;
        }

        $result = $result->fetch_all(MYSQLI_ASSOC);
        array_unshift($result, 0);
        return $result;
      }

    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function findPostsByQuery($searchQuery, &$errors) {    
    try {
      $param = "%{$searchQuery}%";
      $query = "SELECT *,
      (SELECT display_name FROM users u WHERE p.author = u.user_id) AS display_name,
      (SELECT mail FROM users u WHERE p.author = u.user_id) AS email,
      (SELECT image FROM users u WHERE p.author = u.user_id) AS image
      FROM posts p WHERE title LIKE ?
      ORDER BY date_created DESC";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $param);

      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }

  public function getTopPosts(&$errors) {    
    try {
      $query = "SELECT *,
      (SELECT display_name FROM users u WHERE p.author = u.user_id) AS display_name,
      (SELECT mail FROM users u WHERE p.author = u.user_id) AS email,
      (SELECT image FROM users u WHERE p.author = u.user_id) AS image
      FROM posts p ORDER BY date_created DESC LIMIT 7";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
      return $result;
    } catch (Exception $e) {
      $errors["execute_err"] = "Error occured";
      return;
    }
  }
}