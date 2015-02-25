<?php

$host = "mysql.imerir.com"; // serveur mysql
$db = "CNRS";       // nom de la BDD
$user = "CNRS";       // login de l'utilisateur de la BDD
$pass = "stationmeteo"; // mot de passe de l'utilisateur de la BDD

echo $json = '{"temperatures":[{"heure":"8h00","temperature":"7"},{"heure":"8h05","temperature":"7"},{"heure":"8h10","temperature":"7,5"},{"heure":"8h15","temperature":"8"}],"humidite":[{"heure":"8h00","humi":"50"},{"heure":"8h05","humi":"50"},{"heure":"8h10","humi":"45"},{"heure":"8h15","humi":"45"}]}';
/*
@$temperature = $_GET["temp"];
@$pression = $_GET["pression"];
@$humidite = $_GET["humidite"];
//@$date = $_GET["date"];
$date = @date("Y-m-d H:i:s", time());

$dbh = new PDO('mysql:host='.$host.';dbname='.$db, $user, $pass); // accès à la base de données
$stmt = $dbh->prepare("INSERT INTO `donnees` (`id_donnee`, `id_capteur`, `val`, `date_time`) VALUES ('', :id_capteur, :valeur, :date_time)");

$stmt->bindParam(':id_capteur', $id_capteur);
$stmt->bindParam(':valeur', $valeur);
$stmt->bindParam(':date_time', $date_time);

if (isset($temperature)){
  // insertion de la temperature
  $id_capteur = 3;
  $valeur = $temperature;
  $date_time = $date;
  $stmt->execute();

  if ($stmt->errorCode() != 00000){
    echo "Temperature: erreur(".$stmt->errorCode().")";
  }else{
    echo "Temperature: OK";
  }
  
  $nbparam++;
}*/

?>