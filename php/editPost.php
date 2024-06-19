<?php

include 'connection.php';

 // Check if form is submitted
 if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if all necessary data is provided
    if (isset($_POST['id']) && isset($_POST['caption'])) {
        $postId = $_POST['id'];
        $caption = $_POST['caption'];

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $targetDir = "postImage/";
            $targetFile = $targetDir . basename($_FILES["image"]["name"]);
            $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));
            $check = getimagesize($_FILES["image"]["tmp_name"]);
            if ($check !== false) {
                // Allow certain file formats
                if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
                    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                } else {
                    // Move uploaded file to target directory
                    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
                        // Update post with image
                        $sql = "UPDATE post SET caption='$caption', imagePost='$targetFile' WHERE id='$postId'";
                    } else {
                        echo "Sorry, there was an error uploading your file.";
                    }
                }
            } else {
                echo "File is not an image.";
            }
        } else {
            // Update post without image
            $sql = "UPDATE post SET caption='$caption' WHERE id='$postId'";
        }

        // Execute query
        if (mysqli_query($conn, $sql)) {
            echo "Post updated successfully.";
        } else {
            echo "Error updating post: " . mysqli_error($conn);
        }
    } else {
        echo "Missing parameters.";
    }
}