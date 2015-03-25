<?php

include "connexion_bdd.php"; // fichier contenant les infos pour la connexion a la base de donees

@$fvent = $_GET["fvent"];  // recuperation de la valeur de la force de vent
@$dvent = $_GET["dvent"];  // recuperation de la valeur de la direction du vent
@$pluie = $_GET["pluie"];  // recuperation de la valeur du niveau de l'hygrometrie
@$batterie = $_GET["batterie"];  // recuperation de la valeur du niveau de la batterie
@$temperature = $_GET["temp"];  // recuperation de la valeur de la temperature
@$pression = $_GET["pression"]; // recuperation de la valeur de la pression
@$humidite = $_GET["humidite"]; // recuperation de la valeur de l'humidite
@$date = $_GET["date"];         // recuperation de la valeur de la date au format AAAA-MM-JJ
@$heure = $_GET["heure"];       // recuperation de la valeur de l'heure au format hh_mm_ss

$erreur = 0; // variable qui sert a compter le nombre d'erreur pendant l'insertion en base

if (isset($date) && isset($heure)){ // si l'heure et la date ne sont pas renseignees on ne traite pas la requete

  $date = $date." ".$heure; // concatenation de la date et de l'heure
  str_replace("_", ":", $date); // remplacement des _ par des : dans l'heure

  $dbh = new PDO('mysql:host='.$host.';dbname='.$db, $user, $pass); // accès à la base de données
  $stmt = $dbh->prepare("INSERT INTO `donnees` (`id_donnee`, `id_capteur`, `val`, `date_time`) VALUES ('', :id_capteur, :valeur, :date_time)"); // preparation de la raquete SQL d'insertion dans la base

  $stmt->bindParam(':id_capteur', $id_capteur); // association de la variable $id_capteur au parametre :id_capteur 
  $stmt->bindParam(':valeur', $valeur);         // association de la variable $valeur au parametre :valeur
  $stmt->bindParam(':date_time', $date_time);   // association de la variable $date_time au parametre :date_time

  $date_time = $date;     // assignation de la valeur de la date a la variable associee au parametre de la requete

  if (isset($temperature)){ // si la temperature est renseignee, alors on l'ajoute dans la base

    $id_capteur = 3;        // dans la base, l'id_capteur correspondant a la temperature est le 3
    $valeur = $temperature; // assignation de la valeur de la temperature a la variable associee au parametre de la requete
    $stmt->execute();       // execution de la requete preparee

    if ($stmt->errorCode() != 00000){ // 00000 = pas d'erreur | si il y a une erreur on l'affiche, sinon on affiche que c'est bon
      // echo "Temperature: erreur(".$stmt->errorCode().")";
      $erreur++;
    }
  }

  if (isset($pression)){  // si la temperature est renseignee, alors on l'ajoute dans la base
   
    $id_capteur = 2;      // dans la base, l'id_capteur correspondant a la pression est le 2
    $valeur = $pression;  // assignation de la valeur de la pression a la variable associee au parametre de la requete
    $stmt->execute();     // execution de la requete preparee

    if ($stmt->errorCode() != 00000){// 00000 = pas d'erreur | si il y a une erreur on l'affiche, sinon on affiche que c'est bon
      // echo "<br>Pression: erreur(".$stmt->errorCode().")";
      $erreur++;
    }
  }

  if (isset($humidite)){
    // insertion du taux d'humidite
    $id_capteur = 1;      // dans la base, l'id_capteur correspondant a l'humidite est le 1
    $valeur = $humidite;  // assignation de la valeur de l'humidite a la variable associee au parametre de la requete
    $stmt->execute();     // execution de la requete preparee

    if ($stmt->errorCode() != 00000){// 00000 = pas d'erreur | si il y a une erreur on l'affiche, sinon on affiche que c'est bon
      // echo "<br>Humidite: erreur(".$stmt->errorCode().")";
      $erreur++;
    }
  }

  if (isset($batterie)){ // si le niveau de batterie est renseigne, alors on l'ajoute dans la base

    $id_capteur = 4;        // dans la base, l'id_capteur correspondant a la batterie est le 4
    $valeur = $batterie;    // assignation de la valeur de la temperature a la variable associee au parametre de la requete
    $stmt->execute();       // execution de la requete preparee

    if ($stmt->errorCode() != 00000){ // 00000 = pas d'erreur | si il y a une erreur on l'affiche, sinon on affiche que c'est bon
      // echo "Temperature: erreur(".$stmt->errorCode().")";
      $erreur++;
    }
  }

  if (isset($fvent)){ // si la force du vent est renseignee, alors on l'ajoute dans la base

    $id_capteur = 5;        // dans la base, l'id_capteur correspondant a la force du vent est le 5
    $valeur = $fvent;       // assignation de la valeur de la force du vent a la variable associee au parametre de la requete
    $stmt->execute();       // execution de la requete preparee

    if ($stmt->errorCode() != 00000){ // 00000 = pas d'erreur | si il y a une erreur on l'affiche, sinon on affiche que c'est bon
      // echo "Temperature: erreur(".$stmt->errorCode().")";
      $erreur++;
    }
  }

  if (isset($dvent)){ // si la direction du vent est renseignee, alors on l'ajoute dans la base

    $id_capteur = 6;        // dans la base, l'id_capteur correspondant a la direction du vent est le 6
    $valeur = $dvent;       // assignation de la valeur de la direction du vent a la variable associee au parametre de la requete
    $stmt->execute();       // execution de la requete preparee

    if ($stmt->errorCode() != 00000){ // 00000 = pas d'erreur | si il y a une erreur on l'affiche, sinon on affiche que c'est bon
      // echo "Temperature: erreur(".$stmt->errorCode().")";
      $erreur++;
    }
  }

  if (isset($pluie)){ // si l'hygrometrie' est renseignee, alors on l'ajoute dans la base

    $id_capteur = 7;        // dans la base, l'id_capteur correspondant a l'hygrometrie est le 7
    $valeur = $pluie;       // assignation de la valeur de l'hygrometrie a la variable associee au parametre de la requete
    $stmt->execute();       // execution de la requete preparee

    if ($stmt->errorCode() != 00000){ // 00000 = pas d'erreur | si il y a une erreur on l'affiche, sinon on affiche que c'est bon
      // echo "Temperature: erreur(".$stmt->errorCode().")";
      $erreur++;
    }
  }

  if ($erreur != 0){
    echo "2";
  }else{
    echo "1";
  }
}else{
  echo "Date et/ou heure non renseignée(s) !";
}  
?>