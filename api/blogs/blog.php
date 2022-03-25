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
  } else if (isset($_GET["getBlogReactions"])) {
    if (!isset($_GET["blog_id"])) {
      http_response_code(400);
      exit;
    }

    $blog = new Blog($conn);

    $errors = [];
    $info = $blog->getReactions($_GET["blog_id"], $errors);

    if (!empty($errors)) {
      var_dump($errors);
      http_response_code(400);
      exit;
    } else {
      echo json_encode($info);
    }
  } else if (isset($_POST["updateReaction"])) {
    if (!isset($_POST["type"]) || !isset($_POST["reaction"]) ||
    !isset($_POST["uid"]) || !isset($_POST["blog_id"])) {
      http_response_code(400);
      exit;
    }

    $blog = new Blog($conn);

    $errors = [];
    $blog->updateReaction($_POST["uid"], $_POST["blog_id"],$_POST["type"], $_POST["reaction"], $errors);

    if (!empty($errors)) {
      var_dump($errors);
      http_response_code(400);
      exit;
    } else {
      http_response_code(200);
    }
  } else if (isset($_GET["getBlogReactionDetails"])) {
    if (!isset($_GET["blog_id"])) {
      http_response_code(400);
      exit;
    }

    $blog = new Blog($conn);

    $errors = [];
    $info = $blog->getReactionDetails($_GET["blog_id"], $errors);

    if (!empty($errors)) {
      var_dump($errors);
      http_response_code(400);
      exit;
    } else {
      echo json_encode($info);
    }
  } else if (isset($_POST["updateComment"])) {
    if (!isset($_POST["type"]) || !isset($_POST["comment"]) ||
    !isset($_POST["uid"]) || !isset($_POST["blog_id"])) {
      http_response_code(400);
      exit;
    }

    $blog = new Blog($conn);

    $childOf = isset($_POST["childOf"])? $_POST["childOf"] : null;
    $originalID = isset($_POST["originalID"])? $_POST["originalID"] : null;

    $errors = [];
    $commentID = $blog->updateComment($_POST["uid"], $_POST["blog_id"],$_POST["type"], $_POST["comment"], $childOf, $originalID, $errors);

    if (!empty($errors)) {
      var_dump($errors);
      http_response_code(400);
      exit;
    } else {
      echo $commentID;
      http_response_code(200);
    }
  } else if (isset($_GET["getBlogComments"])) {
    if (!isset($_GET["blog_id"])) {
      http_response_code(400);
      exit;
    }

    $blog = new Blog($conn);

    $errors = [];
    $info = $blog->getComments($_GET["blog_id"], $errors);

    if (!empty($errors)) {
      var_dump($errors);
      http_response_code(400);
      exit;
    } else {
      echo json_encode($info);
    }
  } if (isset($_GET["getTopPosts"])) {
    $blog = new Blog($conn);

    $errors = [];
    $results = $blog->getTopPosts($errors);

    if (!empty($errors)) {
      http_response_code(400);
      exit;
    } else {
      echo json_encode($results);
    }
  }