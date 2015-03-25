<?php

include "connexion_bdd.php"; // fichier contenant les infos pour la connexion a la base de donees

@$valeur = $_GET["val"];            // recuperation de la valeur du capteur
@$id_capteur = $_GET["idcapteur"]; // recuperation du numero du capteur
@$date = $_GET["date"];           // recuperation de la valeur de la date au format AAAA-MM-JJ_hh-mm-ss

if (isset($date) && isset($id_capteur) && isset($valeur)){ // si la date, l'id_capteur ou la valeur ne sont pas renseignees on ne traite pas la requete

  // traitement de la date pour qu'elle corresponde au format de la BDD
  $date = explode("_", $date);                // separation de la date et de l'heure, permet de traiter l'heure et retire l'underscore
  $date[1] = str_replace("-", ":", $date[1]); // changement des tirets en deux-points dans l'heure
  $date_time = implode(" ", $date);           // fusion de la date et l'heure avec un espace entre les deux
  
  $dbh = new PDO('mysql:host='.$host.';dbname='.$db, $user, $pass); // accès à la base de données

  // preparation de la raquete SQL d'insertion dans la base
  $stmt = $dbh->prepare("INSERT INTO `donnees` (`id_donnee`, `id_capteur`, `val`, `date_time`) VALUES ('', :id_capteur, :valeur, :date_time)"); 

  $stmt->bindParam(':id_capteur', $id_capteur); // association de la variable $id_capteur au parametre :id_capteur 
  $stmt->bindParam(':valeur', $valeur);         // association de la variable $valeur au parametre :valeur
  $stmt->bindParam(':date_time', $date_time);   // association de la variable $date_time au parametre :date_time

  $stmt->execute();       // execution de la requete preparee

  if ($stmt->errorCode() != 00000){ // 00000 = pas d'erreur | si il y a une erreur on l'affiche
    echo "2";
  }else{
    echo "1";
  }
}else{
  echo "Certaines variables ne sont pas renseignées !";
}  
?>