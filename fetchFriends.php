<?php
// Include your database connection file
session_start();
include 'connection.php';

// Get the current user's ID
$currentUserId = $_SESSION['id'];


$query = "SELECT * FROM friends WHERE status = 'Accepted' AND (user_id = $currentUserId OR friend_id = $currentUserId)";
$result = mysqli_query($conn, $query);

$friends_data = array();
while ($row = mysqli_fetch_assoc($result)) {
    $user_id = $row['user_id'];
    $friend_id = $row['friend_id'];

    // Check if the friendship is mutual
    $mutual_query = "SELECT * FROM friends WHERE user_id = $user_id AND friend_id = $friend_id AND status = 'Accepted'";
    $mutual_result = mysqli_query($conn, $mutual_query);

    if (mysqli_num_rows($mutual_result) > 0) {
        // Retrieve user data for both users
        $user_query = "SELECT * FROM accounts WHERE id IN ($user_id, $friend_id)";
        $user_result = mysqli_query($conn, $user_query);

        $users_data = array();
        while ($user_row = mysqli_fetch_assoc($user_result)) {
            $users_data[] = $user_row;
        }

        // Add friend data to the array
        $friends_data[] = $users_data;
    }
}

// Output the friends data as JSON
echo json_encode($friends_data);

// Close the connection
mysqli_close($conn);
?>
