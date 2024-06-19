<?php
include 'connection.php';

$commentId = $_POST['commentId'];
$commentText = $_POST['updatedComment'];

$sql = "UPDATE comments SET comment = '$commentText' WHERE id = '$commentId'";
if ($conn->query($sql) === TRUE) {
    echo json_encode(array('res' => 'success'));
} else {
    echo json_encode(array('res' => 'error', 'message' => $conn->error));
}

$conn->close();
?>
