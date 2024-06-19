    <?php
    include "connection.php";
    session_start();

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = mysqli_real_escape_string($conn, $_POST['username']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);

        if ($username != "" && $password != "") {
            $query = "SELECT * FROM accounts WHERE username = '$username' AND password = '$password'";
            $result = mysqli_query($conn, $query);

            if (mysqli_num_rows($result) == 1) {
                $row = mysqli_fetch_assoc($result);
                $_SESSION['username'] = $username;
                $_SESSION['name'] = $row['name']; 
                $_SESSION['id'] = $row['id'];
                echo json_encode(array(
                    'res' => 'success',
                    'id' => $row['id'],
                    'username' => $username,
                    'password' => $password,
                    'name' => $row['name'],
                    'gender' => $row['gender'],
                    'location' => $row['location'],
                    'civilStatus' => $row['civilStatus'],
                    'birthdate' => $row['birthdate'],
                    'image' => $row['image']
                ));
                exit;
            } else {
                echo json_encode(array("res" => "error", "message" => "Invalid username or password."));
                exit;
            }
        } else {
            echo json_encode(array("res" => "error", "message" => "Please provide both a username and a password for login."));
            exit;
        }
    }
    ?>
