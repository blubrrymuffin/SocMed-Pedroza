<?php
// Include your database connection file
include 'connection.php';

// Check if the friendId parameter is set in the POST request
if(isset($_POST['friendId'])) {
    $friendId = $_POST['friendId'];

    // Remove the friend from the friends table
    $query = "DELETE FROM friends WHERE user_id = $friendId";
    $result = mysqli_query($conn, $query);
    
    if($result) {
        echo "Friend removed successfully";
    } else {
        echo "Failed to remove friend";
    }
} else {
    echo "Friend ID not provided";
}

// Close the connection
mysqli_close($conn);
?>
