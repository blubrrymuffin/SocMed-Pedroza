<?php
session_start();
include 'connection.php';

if(isset($_SESSION['id'])) {
    $userId = $_SESSION['id']; 

    $sql = "SELECT n.*, u.name AS friend_name
            FROM likepost n
            JOIN accounts u ON n.friend_id = u.id
            WHERE n.user_id = '$userId'";

    $result = $conn->query($sql);

    $notifications = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $message = $row['friend_name'] . ' ' . $row['notify']; // Adjust 'status' to match your database column name
            $row['message'] = $message;
            $notifications[] = $row;
        }
    }

    $conn->close();

    echo json_encode($notifications);
} else {
    echo json_encode(array("error" => "Session not started or user not logged in"));
}
?>
