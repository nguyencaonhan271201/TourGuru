<?php
  $image = $_FILES["upload"];

  //Save image to storage
  if ($image["tmp_name"] != '') {
    $fname = $image['name'];
    $ftype = $image['type'];
    $ftmp = $image['tmp_name'];
    $ferr = $image['error'];
    $fsize = $image['size'];
    $allowed_ext = ['png', 'jpg', 'jpeg', '.bmp', '.PNG', '.JPG', '.JPEG', '.BMP', '.gif', '.GIF'];

    //Check if there are errors on upload
    if ($ferr != 0) {
      echo json_encode(["error" => "File error."]);
      return;
      $errors["image"] = "File error.";
      $profileErr = true;
    }

    //Check file type and extension
    $ftype = explode("/", $ftype);
    if ($ftype[0] != 'image' || !in_array(end($ftype), $allowed_ext)) {
      echo json_encode(["error" => "Images only."]);
      return;
      $errors["image"] = "Images only.";
      $profileErr = true;
    }

    //Check file size
    if ($fsize > 5242880) {
      echo json_encode(["error" => "File is too large."]);
      return;
      $profileErr = true;
    }

    //Error by upload constraints of server
    if ($image['error'] == 1) {
        echo json_encode(["error" => "Upload error."]);
        return;
        $profileErr = true;
    }

    if (!isset($profileErr)) {
      $newFilename = uniqid('', true) . "." . end($ftype);
      $dest = "../../shared/assets/images/posts/" . $newFilename;
      if(move_uploaded_file($ftmp, $dest)) {
        echo json_encode(["url" => $dest]);
        return;
      } else {
        echo json_encode(["error" => "Error occured. Please try again later."]);
        return;
      }
    }   
}

echo json_encode(["error" => "File is too large or invalid."]);
return;
