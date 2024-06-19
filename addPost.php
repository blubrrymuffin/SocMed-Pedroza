<?php

session_start();

$logged_id = $_SESSION['user_id'];

include "connection.php";

if (isset($_POST['post'])) {
    $user_id = $_POST['poster_id'];
    $caption = $_POST['caption'];

    // Start transaction
    $conn->begin_transaction();

    try {
        // Insert post into post table
        $stmt = $conn->prepare("INSERT INTO post (poster_id, caption) VALUES (?, ?)");
        $stmt->bind_param("ss", $user_id, $caption);

        if ($stmt->execute() === TRUE) {
            $post_id = $conn->insert_id; // Get the ID of the inserted post
        } else {
            throw new Exception("Post was not successful");
        }
        $stmt->close();

        // Check if files are uploaded
        if (isset($_FILES["imageInput"])) {
            $target_dir = "uploads/post/";
            $files = $_FILES["imageInput"];
            $file_count = count($files['name']);
            
            for ($i = 0; $i < $file_count; $i++) {
                if ($files["error"][$i] == UPLOAD_ERR_OK) {
                    $target_file = $target_dir . basename($files["name"][$i]);
                    $uploadOk = 1;
                    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

                    $check = getimagesize($files["tmp_name"][$i]);
                    if ($check === false) {
                        throw new Exception("File is not an image.");
                    }

                    if ($files["size"][$i] > 100000000) {
                        throw new Exception("Sorry, your file is too large.");
                    }

                    // Allow certain file formats
                    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
                        throw new Exception("Sorry, only JPG, JPEG, PNG & GIF files are allowed.");
                    }

                    if (move_uploaded_file($files["tmp_name"][$i], $target_file)) {
                        $image = $target_file;

                        // Insert image into photo table
                        $stmt = $conn->prepare("INSERT INTO photos (post_id, image) VALUES (?, ?)");
                        $stmt->bind_param("ss", $post_id, $image);

                        if ($stmt->execute() !== TRUE) {
                            throw new Exception("Image insertion failed.");
                        }
                        $stmt->close();
                    } else {
                        throw new Exception("Sorry, there was an error uploading your file.");
                    }
                }
            }
        }

        // Commit transaction
        $conn->commit();
        echo json_encode(["success" => true, "message" => "Post was successful"]);

    } catch (Exception $e) {
        // Rollback transaction
        $conn->rollback();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

$conn->close();
?>
