<?php

include 'connection.php';

$personId = $_POST['personId'];
$userId = $_POST['userId'];

$checkQuery = "SELECT * FROM friend_request WHERE sender_id = $personId AND receiver_id = $userId";
$checkResult = $conn->query($checkQuery);

if ($checkResult->num_rows > 0) {
    $updateQuery = "UPDATE friend_request SET status = 'accepted' WHERE sender_id = $userId AND receiver_id = $personId";
    if ($conn->query($updateQuery) === TRUE) {
        $addFriendshipQuery = "INSERT INTO friends (user_id, friend_id) VALUES ($userId, $personId)";
        if ($conn->query($addFriendshipQuery) === TRUE) {
            $response = array('res' => 'success', 'message' => 'Friend request accepted.');
        } else {
            $response = array('res' => 'error', 'message' => 'Error accepting friend request.');
        }
    } else {
        $response = array('res' => 'error', 'message' => 'Error updating friend request status.');
    }
} else {
    // Friend request does not exist, insert a new friend request
    $insertQuery = "INSERT INTO friend_request (sender_id, receiver_id, status) VALUES ($userId, $personId, 'pending')";
    if ($conn->query($insertQuery) === TRUE) {
        $response = array('res' => 'success', 'message' => 'Friend request sent.');
    } else {
        $response = array('res' => 'error', 'message' => 'Error sending friend request.');
    }
}

$conn->close();

echo json_encode($response);
?>