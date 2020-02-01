<?php
include 'prockiConfig.php';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = $_POST['outputData'];
$stmt = $conn->prepare("INSERT INTO Procki VALUES (null, ?)");
$stmt->bind_param("s", $data);


if ($stmt->execute() === TRUE) {
    echo "Dziękujemy! Twój wynik został poprawnie przesłany!";
} else {
    echo "Error: " . $conn->error;
}

$stmt->close();
$conn->close();

?>
