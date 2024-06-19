<?php
include 'connection.php';
session_start();

$loggedInID = $_SESSION['id'];

// Get all friends with accepted status
$friendsQuery = "SELECT * FROM friends WHERE (user_id = $loggedInID OR friend_id = $loggedInID) AND status = 'Accepted'";
$friendsResult = mysqli_query($conn, $friendsQuery);

$friendIDs = array($loggedInID); // Include the logged-in user's ID
while ($friendRow = mysqli_fetch_assoc($friendsResult)) {
    if ($friendRow['user_id'] == $loggedInID) {
        $friendIDs[] = $friendRow['friend_id'];
    } else {
        $friendIDs[] = $friendRow['user_id'];
    }
}

$friendIDsString = implode(',', $friendIDs);

// Get posts of friends with accepted status
$postsQuery = "SELECT post.*, accounts.username, accounts.name, accounts.image FROM post JOIN accounts ON post.user_id = accounts.id WHERE post.user_id IN ($friendIDsString) ORDER BY post.time DESC";
$postsResult = mysqli_query($conn, $postsQuery);

$posts = array();
while ($postRow = mysqli_fetch_assoc($postsResult)) {
    $posts[] = $postRow;
}

echo json_encode($posts);

$conn->close();
?>
