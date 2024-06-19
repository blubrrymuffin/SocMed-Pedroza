    <?php
    include 'connection.php';

    $userId = $_POST['user_id'];
    $friendId = $_POST['friend_id'];
    $postId = $_POST['post_id'];
    $commentText = $_POST['status'];

    $sql = "INSERT INTO likepost (user_id, friend_id, post_id, notify) VALUES ('$friendId', '$userId', '$postId', '$commentText')";

    if ($conn->query($sql) === TRUE) {
        $response = array('res' => 'success');
    } else {
        $response = array('res' => 'error', 'message' => $conn->error);
    }

    $conn->close(); 

    echo json_encode($response);
    ?>