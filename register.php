<?php
include "connection.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    if ($username != "" && $password != "") {
        $checkQuery = "SELECT * FROM accounts WHERE username = '$username'";
        $checkResult = mysqli_query($conn, $checkQuery);

        if (mysqli_num_rows($checkResult) == 0) {
            $query = "INSERT INTO accounts (name, username, password) VALUES ('$name', '$username', '$password')";
            $result = mysqli_query($conn, $query);

            if ($result) {
                echo json_encode(array("res" => "success"));
                exit;
            } else {
                echo json_encode(array("res" => "error", "message" => "Error registering the user."));
                exit;
            }
        } else {
            echo json_encode(array("res" => "error", "message" => "Username already exists. Choose a different one."));
            exit;
        }
    } else {
        echo json_encode(array("res" => "error", "message" => "Please provide both a username and a password for sign-up."));
        exit;
    }
}
?>
