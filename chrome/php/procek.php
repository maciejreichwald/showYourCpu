<?php
include 'prockiConfig.php';
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$data = $_POST['outputData'];
$sql = "INSERT INTO Procki VALUES (null, '";
$sql = $sql . $data;
$sql = $sql . "')";

if ($conn->query($sql) === TRUE) {
    echo "Dziękujemy! Twój wynik został poprawnie przesłany!";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
