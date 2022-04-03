<?php
    include "db.php";
    $offset = 10;
    $sql = 
    "SELECT user_id as userID, display_name as userName, mail, date_created as timeCreated
    FROM users
    ORDER BY date_created DESC
    LIMIT ?  ";

    //userID,userName, mail, timeCreated

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $offset);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    var_dump(array_slice($result, -10));
?>
