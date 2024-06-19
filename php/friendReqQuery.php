<?php
include 'connection.php';

$senderId = $_POST['senderId'];
$receiverId = $_POST['receiverId'];
$status = $_POST['status'];
$senderIdD = $_POST['senderIdD'];

$updateQuery = "DELETE FROM friend_request  WHERE id = $senderId";

if ($conn->query($updateQuery) === TRUE) {
    // Update successful, insert into friends table
    $insertQuery = "INSERT INTO friends (user_id, friend_id, status) VALUES ('$receiverId', '$senderIdD', '$status')";

    if ($conn->query($insertQuery) === TRUE) {
        $response = array('res' => 'success', 'message' => 'Friend request updated and added to friends successfully.');
    } else {
        $response = array('res' => 'error', 'message' => 'Error adding to friends table.');
    }
} else {
    $response = array('res' => 'error', 'message' => 'Error updating friend request status.');
}

$conn->close();

echo json_encode($response);
?>
