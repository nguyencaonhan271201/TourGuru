<?php
  session_start();
  //require_once ("../db.php");
  include('../../shared/classes/Blog.php');
  require_once("../../shared/classes/Database.php");

  $db = Database::getInstance();
  $conn = $db->getConnection();
  
  if (isset($_GET["csrf"]) && ($_GET["csrf"] == $_SESSION["csrf"])) {
    if (isset($_GET["findPostsByAuthor"])) {
      if (!isset($_GET["author"])) {
        http_response_code(400);
        exit;
      }
      
      $blog = new Blog($conn);

      $errors = [];
      $results = $blog->findPostsByAuthor($_GET["author"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($results);
      }
    } else if (isset($_GET["findPostsByAuthor"])) {
      if (!isset($_GET["author"])) {
        http_response_code(400);
        exit;
      }
      
      $blog = new Blog($conn);

      $errors = [];
      $results = $blog->findPostsByAuthor($_GET["author"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($results);
      }
    } else if (isset($_GET["findPostsByCategory"])) {
      if (!isset($_GET["category"])) {
        http_response_code(400);
        exit;
      }
      
      $blog = new Blog($conn);

      $errors = [];
      $results = $blog->findPostsByCategory($_GET["category"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($results);
      }
    } else if (isset($_GET["findPostsByQuery"])) {
      if (!isset($_GET["query"])) {
        http_response_code(400);
        exit;
      }
      
      $blog = new Blog($conn);

      $errors = [];
      $results = $blog->findPostsByQuery($_GET["query"], $errors);

      if (!empty($errors)) {
        http_response_code(400);
        exit;
      } else {
        echo json_encode($results);
      }
    }  
  } else {
    http_response_code(400);
    exit;
  }
?>