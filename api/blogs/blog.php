<?php
  session_start();
  //require_once ("../db.php");
  include('../../shared/classes/Blog.php');
  require_once("../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();

  if (isset($_GET["getBlogInfo"])) {
    if (!isset($_GET["user_id"]) || !isset($_GET["blog_id"])) {
      http_response_code(400);
      exit;
    }

    $blog = new Blog($conn);

    $errors = [];
    $info = $blog->getPublicInfo($_GET["blog_id"], $errors);

    if (!empty($errors)) {
      http_response_code(400);
      exit;
    } else {
      echo json_encode($info);
    }
  } 