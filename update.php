<?php
include "connection.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate inputs
    $id = $_POST['id'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $name = $_POST['name'];
    $gender = $_POST['gender'];
    $location = $_POST['location'];
    $civilStatus = $_POST['civilStatus'];
    $birthdate = $_POST['birthdate'];

    if ($username && $password && $name && $gender && $location && $civilStatus && $birthdate) {
        $imagePath = '';

        // Check if a new image was uploaded
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/';
            $tempFilePath = $_FILES['image']['tmp_name'];
            $fileName = uniqid() . '_' . $_FILES['image']['name'];
            $targetFilePath = $uploadDir . $fileName;

            // Move the uploaded file to the target directory
            if (move_uploaded_file($tempFilePath, $targetFilePath)) {
                $imagePath = $targetFilePath;

                // Delete the old image file if it exists
                $query = "SELECT image FROM accounts WHERE id = ?";
                $statement = $conn->prepare($query);
                $statement->bind_param("i", $id);
                $statement->execute();
                $statement->bind_result($oldImage);
                $statement->fetch();
                $statement->close();

                if ($oldImage && file_exists($oldImage)) {
                    unlink($oldImage);
                }
            } else {
                echo json_encode(array("res" => "error", "message" => "Failed to move uploaded file."));
                exit;
            }
        }

        // Update the profile information in the database
        $query = "UPDATE accounts SET name = ?, username = ?, password = ?, gender = ?, location = ?, civilStatus = ?, birthdate = ?, image = ? WHERE id = ?";
        $statement = $conn->prepare($query);
        $statement->bind_param("ssssssssi", $name, $username, $password, $gender, $location, $civilStatus, $birthdate, $imagePath, $id);
        $result = $statement->execute();

        if ($result) {
            $_SESSION['name'] = $name; 
            echo json_encode(array("res" => "success", "message" => "Profile updated successfully.", "image" => $imagePath));
            exit;
        } else {
            echo json_encode(array("res" => "error", "message" => "Failed to update profile."));
            exit;
        }
    } else {
        echo json_encode(array("res" => "error", "message" => "Please fill in all the fields."));
        exit;
    }
}
?>

?>
