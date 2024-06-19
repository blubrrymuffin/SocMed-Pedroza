<?php
include 'connection.php';

$userId = $_POST['userId'];

$fetchQuery = "SELECT fr.id, fr.sender_id, fr.receiver_id, fr.status, a.name AS sender_name
               FROM friend_request fr
               INNER JOIN accounts a ON fr.sender_id = a.id
               WHERE fr.receiver_id = $userId";

$result = $conn->query($fetchQuery);

$requests = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $requests[] = array(
            'id' => $row['id'],
            'sender_id' => $row['sender_id'],
            'receiver_id' => $row['receiver_id'],
            'sender_name' => $row['sender_name'],
            'status' => $row['status']
        );
    }
}

$conn->close();

echo json_encode($requests);
?>
