<?php
session_start();
include 'connection.php';

header('Content-Type: application/json');

function send_json_response($data) {
    ob_clean(); // Clean (erase) the output buffer and turn off output buffering
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['deletePost'])) {
        $postId = $_POST['post_id'];
        $query = "SELECT image FROM post WHERE post_id = $postId";
        $res = mysqli_query($conn, $query);
        $fileDeleted = true;

        while ($row = mysqli_fetch_assoc($res)) {
            $filePath = $row['image'];
            if (file_exists($filePath)) {
                if (!unlink($filePath)) {
                    $fileDeleted = false;
                }
            }
        }

        $query = "DELETE FROM post WHERE post_id = $postId";
        $res = mysqli_query($conn, $query);

        if ($res && $fileDeleted) {
            send_json_response(["success" => true, "message" => "Post and files were deleted"]);
        } elseif ($res) {
            send_json_response(["success" => true, "message" => "Post was deleted, but some files were not found or deleted"]);
        } else {
            send_json_response(["success" => false, "message" => "Post was not deleted"]);
        }
    }

    if (isset($_POST['edit'])) {
        $post_id = $_POST['post_id'];
        $caption = $_POST['caption'];

        // Update post caption
        $query = "UPDATE post SET caption=? WHERE post_id=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('si', $caption, $post_id);
        $stmt->execute();

        if (!$stmt->affected_rows) {
            send_json_response(["success" => false, "message" => "Post caption was not updated"]);
            exit;
        }

        // Handle image uploads and updates
        if (!empty(array_filter($_FILES['imageInputs']['name']))) {
            // Delete previous images
            $query = "DELETE FROM photos WHERE post_id=?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('i', $post_id);
            $stmt->execute();

            // Upload new images
            $target_dir = "assets/post/";
            $files = $_FILES["imageInputs"];
            $file_count = count($files['name']);

            try {
                for ($i = 0; $i < $file_count; $i++) {
                    if ($files["error"][$i] == UPLOAD_ERR_OK) {
                        $target_file = $target_dir . basename($files["name"][$i]);
                        $uploadOk = 1;
                        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

                        $check = getimagesize($files["tmp_name"][$i]);
                        if ($check === false) {
                            throw new Exception("File is not an image.");
                        }

                        if ($files["size"][$i] > 100000000) { // Adjust size limit as per your requirement
                            throw new Exception("Sorry, your file is too large.");
                        }

                        // Allow certain file formats
                        $allowed_extensions = array('jpg', 'jpeg', 'png', 'gif');
                        if (!in_array($imageFileType, $allowed_extensions)) {
                            throw new Exception("Sorry, only JPG, JPEG, PNG & GIF files are allowed.");
                        }

                        if (move_uploaded_file($files["tmp_name"][$i], $target_file)) {
                            $image = $target_file;

                            // Insert image into photos table
                            $query = "INSERT INTO photos (post_id, image) VALUES (?, ?)";
                            $stmt = $conn->prepare($query);
                            $stmt->bind_param("is", $post_id, $image);
                            $stmt->execute();

                            if ($stmt->affected_rows === 0) {
                                throw new Exception("Image insertion failed.");
                            }
                        } else {
                            throw new Exception("Sorry, there was an error uploading your file.");
                        }
                    }
                }

                // Commit transaction
                mysqli_commit($conn);
                send_json_response(["success" => true, "message" => "Post caption and images were updated"]);

            } catch (Exception $e) {
                // Rollback transaction
                mysqli_rollback($conn);
                send_json_response(["success" => false, "message" => $e->getMessage()]);
            }
        } else {
            // No image update needed
            send_json_response(["success" => true, "message" => "Post caption was updated"]);
        }
    }
}   

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_SESSION['user_id'];

    if (isset($_GET['post_id'])) {
        $postId = $_GET['post_id'];
        $query = "SELECT post.*, accounts.username, accounts.profile_photo, accounts.name, photos.image
                  FROM post
                  INNER JOIN accounts ON post.poster_id = accounts.id
                  LEFT JOIN photos ON post.post_id = photos.post_id
                  WHERE post.post_id = ?
                  AND (
                      post.poster_id = ?
                      OR post.poster_id IN (
                          SELECT friend_id FROM friend WHERE user_id = ? AND status = 'mutual'
                          UNION
                          SELECT user_id FROM friend WHERE friend_id = ? AND status = 'mutual'
                      )
                  )";

        $stmt = $conn->prepare($query);
        $stmt->bind_param('iiii', $postId, $userId, $userId, $userId);
        $stmt->execute();
        $res = $stmt->get_result();

        $posts = array();
        while ($row = mysqli_fetch_assoc($res)) {
            $posts[$row['post_id']]['post_data'] = [
                'post_id' => $row['post_id'],
                'poster_id' => $row['poster_id'],
                'caption' => $row['caption'],
                'time_created' => $row['time_created'],
                'username' => $row['username'],
                'profile_photo' => $row['profile_photo'],
                'name' => $row['name']
            ];
            if (!empty($row['image'])) {
                $posts[$row['post_id']]['images'][] = $row['image'];
            }
        }

        // Fetch like counts
        $query = "SELECT post_id, COUNT(*) AS like_count FROM like_couter GROUP BY post_id";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $res = $stmt->get_result();

        $likeCounts = array();
        while ($row = mysqli_fetch_assoc($res)) {
            $likeCounts[$row['post_id']] = $row['like_count'];
        }

        // Merge like counts with posts data
        foreach ($posts as &$post) {
            $postId = $post['post_data']['post_id'];
            $post['like_count'] = isset($likeCounts[$postId]) ? $likeCounts[$postId] : 0;
        }

        send_json_response(array_values($posts));
    }

    $query = "SELECT post.*, accounts.username, accounts.profile_photo, accounts.name, photos.image
              FROM post
              INNER JOIN accounts ON post.poster_id = accounts.id
              LEFT JOIN photos ON post.post_id = photos.post_id
              WHERE post.poster_id = ?
              OR post.poster_id IN (
                  SELECT friend_id FROM friend WHERE user_id = ? AND status = 'mutual'
                  UNION
                  SELECT user_id FROM friend WHERE friend_id = ? AND status = 'mutual'
              )
              ORDER BY time_created DESC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('iii', $userId, $userId, $userId);
    $stmt->execute();
    $res = $stmt->get_result();

    $posts = array();
    while ($row = mysqli_fetch_assoc($res)) {
        $posts[$row['post_id']]['post_data'] = [
            'post_id' => $row['post_id'],
            'poster_id' => $row['poster_id'],
            'caption' => $row['caption'],
            'time_created' => $row['time_created'],
            'username' => $row['username'],
            'profile_photo' => $row['profile_photo'],
            'name' => $row['name']
        ];
        if (!empty($row['image'])) {
            $posts[$row['post_id']]['images'][] = $row['image'];
        }
    }

    // Fetch like counts
    $query = "SELECT post_id, COUNT(*) AS like_count FROM like_couter GROUP BY post_id";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $res = $stmt->get_result();

    $likeCounts = array();
    while ($row = mysqli_fetch_assoc($res)) {
        $likeCounts[$row['post_id']] = $row['like_count'];
    }

    // Merge like counts with posts data
    foreach ($posts as &$post) {
        $postId = $post['post_data']['post_id'];
        $post['like_count'] = isset($likeCounts[$postId]) ? $likeCounts[$postId] : 0;
    }

    send_json_response(array_values($posts));
}
?>