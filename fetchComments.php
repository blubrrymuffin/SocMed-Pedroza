<?php
include 'connection.php';

$postId = $_POST['postId'];

$sql = "SELECT c.*, u.name AS userName FROM comments c
        JOIN accounts u ON c.user_id = u.id
        WHERE c.postId = '$postId' ORDER BY c.time DESC";
$result = $conn->query($sql);

$comments = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }
}

echo json_encode($comments);

$conn->close();
?>
