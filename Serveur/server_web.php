<?php
include "connexion_bdd.php"; // fichier contenant les infos pour la connexion a la base de donees

if (isset($_POST["capteur"]) && isset($_POST["dateDebut"]) && isset($_POST["dateFin"]) && isset($_POST["frequence"])) // si il manque le nom du capteur, la date de debut, la date de fin ou la frequence, on ne fait rien
{	
	$dbh = new PDO('mysql:host='.$host.';dbname='.$db, $user, $pass); // accès à la base de données

	// preparation de la requete SQL pour renvoyer les donnees au client
	$stmt = $dbh->prepare("SELECT * FROM (SELECT date_time, nom, val FROM donnees, capteurs WHERE donnees.id_capteur = capteurs.id_capteur AND donnees.id_capteur LIKE :id_capteur AND date_time BETWEEN :dateDebut AND :dateFin ORDER BY date_time DESC) as sousrequete ORDER BY sousrequete.date_time ASC;");

	$stmt->bindParam(':id_capteur', $id_capteur);	// association de la variable $id_capteur au parametre :id_capteur 
	$stmt->bindParam(':dateDebut', $dateDebut);		// association de la variable $dateDebut au parametre :dateDebut
	$stmt->bindParam(':dateFin', $dateFin);			// association de la variable $dateFin au parametre :dateFin


    switch ($_POST["capteur"]){ // selon le capteur demande, on renseigne le bon id_capteur (valeur de la base de donnees)
		case "temperature": $id_capteur = "3";break; 
		case "pression": $id_capteur = "2";break;
		case "humidite": $id_capteur = "1";break;
		case "tout": $id_capteur = "_";break; // dans le cas ou le client veut toutes les donnees, il envoie "tout". la requete SQL est avec un LIKE, donc le caractere _ remplace n'importe quel autre caractere 
	}

    $dateDebut = implode('-', array_reverse(explode('-', str_replace("/", "-", $_POST["dateDebut"]))))." 00:00:00"; 	// transforme jj/mm/YYYY en YYYY-mm-dd 00:00:00 comme renseigne dans la base
    $dateFin = implode('-', array_reverse(explode('-', str_replace("/", "-", $_POST["dateFin"]))))." 23:59:59";		// transforme jj/mm/YYYY en YYYY-mm-dd 23:59:59 comme renseigne dans la base
    $stmt->execute(); // execution de la requete preparee
	
	if ($stmt->errorCode() != 00000){ // 00000 = pas d'erreur | si il y a une erreur on l'affiche
      print_r($stmt->errorInfo());
    }

	//----------------------------------------------------------------------------------------------------------
	// traitement sur la date vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

	// SELECT date_time, nom, val FROM donnees, capteurs WHERE donnees.id_capteur = capteurs.id_capteur AND date_time LIKE "____-__-08 __:__:__" OR date_time LIKE "____-__-08 __:__:35" OR date_time LIKE "____-__-08 __:__:23" ORDER BY date_time DESC LIMIT 20;

	// traitement sur la date ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	// ---------------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------
	// Date de debut et date de fin du graphe
	// choisir le nombre de valeur que l'on veut afficher
	// affichage par annee : toute l'année 2013 (du 1 janvier au 31 decembre), puis 2014 ...
	// affichage par mois : du 1 au 28,29,30,31
	// affichage de comparaison par période sur plusieurs années : afficher les temperatures des x derniers été
	// ajouter une section record (min|max|moyenne plus haute|moyenne plus basse)
    //----------------------------------------------------------------------------------------------------------
	$stmt = $stmt->fetchAll(); // on passe le resultat de la requete dans un tableau

	$cle = 0; 		// declaration de la variable cle, qui correspond a une cle (ici la date-heure) dans le json de retour
	$capteur = "";	// declaration de la variable capteur, qui correspond a une cle (ici le nom du capteur, exemple: temperature, pression ...) dans le json de retour
	$json = array();// declaration du tableau qui sera encode en json pour le retour au client

	foreach ($stmt as $key => $value) { // on parcours chaque ligne retournee par la requete SQL
	  foreach ($value as $key2 => $value2) { // on parcours chaque variable d'une ligne retournee par la requete SQL
	    if ($key2 == "date_time"){ $cle                  = $value2;} 			// test sur la variable pour renseigner la cle "date"
	    else if($key2 == "nom"){   $capteur              = $value2;}			// renseigne le cle "nom du capteur"
	    else if($key2 == "val"){   $json[$cle][$capteur] = floatval($value2);}	// renseigne la valeur du capteur
	  }
	}

	echo json_encode($json); // affiche le tableau encode en json
}else{
	echo "Il manque des variables !";
}

?>