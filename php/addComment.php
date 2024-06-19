<?php
include 'connection.php';

$userId = $_POST['user_id'];
$friendId = $_POST['friend_id'];
$postId = $_POST['postId'];
$commentText = $_POST['comment'];

$sql = "INSERT INTO comments (user_id, friend_id, postId, comment) VALUES ('$userId', '$friendId', '$postId', '$commentText')";

if ($conn->query($sql) === TRUE) {
    $response = array('res' => 'success');
} else {
    $response = array('res' => 'error', 'message' => $conn->error);
}

$conn->close();

echo json_encode($response);
?>
