<?php
include "connection.php";
session_start();

$loggedInID = $_SESSION['id']; 
$query = "SELECT * FROM accounts WHERE id != $loggedInID AND id NOT IN (SELECT friend_id FROM friends WHERE user_id = $loggedInID AND status IN ('Accepted', 'Rejected'))";
$result = mysqli_query($conn, $query);

$people = array();

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $friendQuery = "SELECT * FROM friends WHERE (user_id = $loggedInID AND friend_id = {$row['id']}) OR (user_id = {$row['id']} AND friend_id = $loggedInID) AND status = 'Accepted'";
        $friendResult = mysqli_query($conn, $friendQuery);
        if (mysqli_num_rows($friendResult) == 0) {
            $people[] = $row;
        }
    }
}

echo json_encode($people);

?>
