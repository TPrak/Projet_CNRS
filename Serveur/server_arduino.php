<?php

$host = "mysql.imerir.com"; // serveur mysql
$db = "CNRS";       // nom de la BDD
$user = "CNRS";       // login de l'utilisateur de la BDD
$pass = "stationmeteo"; // mot de passe de l'utilisateur de la BDD

@$temperature = $_GET["temp"];
@$pression = $_GET["pression"];
@$humidite = $_GET["humidite"];
@$date = $_GET["date"];
@$heure = $_GET["heure"];
// $date = @date("Y-m-d H:i:s", $time);

if (isset($date) && isset($heure)){

  $date = $date." ".$heure;
  str_replace("_", ":", $date);

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
  }

  if (isset($pression)){
    // insertion de la pression
    $id_capteur = 2;
    $valeur = $pression;
    $date_time = $date;
    $stmt->execute();

    if ($stmt->errorCode() != 00000){
      echo "<br>Pression: erreur(".$stmt->errorCode().")";
    }else{
      echo "<br>Pression: OK";
    }
  }

  if (isset($humidite)){
    // insertion du taux d'humidite
    $id_capteur = 1;
    $valeur = $humidite;
    $date_time = $date;
    $stmt->execute();

    if ($stmt->errorCode() != 00000){
      echo "<br>Humidite: erreur(".$stmt->errorCode().")";
    }else{
      echo "<br>Humidite: OK";
    }
  }
}else{
  echo "Date et/ou heure non renseignée(s) !";
}  
?>