<?php
  session_start();
  //require_once ("../db.php");
  include('../../shared/classes/Blog.php');
  require_once("../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();
  
  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["getBlogInfo"])) {
      if (!isset($_GET["user_id"]) || !isset($_GET["blog_id"])) {
        http_response_code(400);
        exit;
      }

      $blog = new Blog($conn);

      $errors = [];
      $info = $blog->getInfo($_GET["user_id"], $_GET["blog_id"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($info);
      }
    } 
  } else if (isset($_POST["csrf"]) && ($_POST["csrf"] == $_SESSION["csrf"])) {
    if (isset($_POST["editBlog"])) {
      if (!isset($_POST["content"]) || !isset($_POST["title"]) || !isset($_POST["category"]) || !isset($_POST["description"])
      || !isset($_POST["user"]) || !isset($_POST["blogID"])) {
        http_response_code(400);
        exit;
      }

      $content = urldecode($_POST["content"]);
      $title = urldecode($_POST["title"]);
      $category = urldecode($_POST["category"]);
      $description = urldecode($_POST["description"]);
      $user = $_POST["user"];
      $plan = $_POST["plan"] !== "-1"? intval($_POST["plan"]) : null;
      if (isset($_FILES["image"])) {
        $cover = $_FILES['image'];
      } else {
        $cover = null;
      }
      $blog_id = $_POST["blogID"];

      $blog = new Blog($conn);
      $errors = [];
      $blog->editBlog($blog_id, $content, $title, $category, $description, $user, $plan, $cover, $errors);

      if (!empty($errors)) {
        echo json_encode($errors);
        http_response_code(400);
        exit;
      } else {
        http_response_code(200);
        exit;
      }
    }
  } else {
    http_response_code(400);
    exit;
  }
?>