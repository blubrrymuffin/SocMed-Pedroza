<?php
include 'connection.php';

$commentId = $_POST['postId'];

$sql = "DELETE FROM post WHERE id = '$commentId'";
if ($conn->query($sql) === TRUE) {
    echo json_encode(array('res' => 'success'));
} else {
    echo json_encode(array('res' => 'error', 'message' => $conn->error));
}

$conn->close();
?>
