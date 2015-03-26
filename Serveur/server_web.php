<?php
include "connexion_bdd.php"; // fichier contenant les infos pour la connexion a la base de donees

$tensionMax = 13;
$tensionMin = 11.7;

if (isset($_POST["capteur"]) && isset($_POST["dateDebut"]) && isset($_POST["dateFin"])) // si il manque le nom du capteur, la date de debut, la date de fin, on ne fait rien
{	
	$dbh = new PDO('mysql:host='.$host.';dbname='.$db, $user, $pass); // accès à la base de données

	// preparation de la requete SQL pour renvoyer les donnees au client
	if ($_POST["capteur"] == "tout"){
		// la requete va chercher les 280 dernieres donnees en base
		// a ce jour (25/03/2015) il y a 7 capteurs en base, et pour avoir un affichage optimal sur le graphe, nous affichons 40 dates
		// donc 7*40=280 -> les 40 dernieres donneees de chaque capteur
		// la requete imbriquee sert a trier les donnees dans l'ordre de la plus ancienne a la plus recente
		$stmt = $dbh->prepare("SELECT * FROM (SELECT date_time, nom, val FROM donnees, capteurs WHERE donnees.id_capteur = capteurs.id_capteur ORDER BY date_time DESC LIMIT 280) as sousrequete ORDER BY sousrequete.date_time ASC;");

	}else if ($_POST["capteur"] == "batterie"){
		// la requete renvoie uniquement la valeur la plus recente pour la batterie
		$stmt = $dbh->prepare("SELECT date_time, nom, val FROM donnees, capteurs WHERE donnees.id_capteur = capteurs.id_capteur AND donnees.id_capteur LIKE :id_capteur ORDER BY date_time DESC LIMIT 1;");
		
		$id_capteur = "4";
		$stmt->bindParam(':id_capteur', $id_capteur);	// association de la variable $id_capteur au parametre :id_capteur 

	}else{
		// la requete va chercher toutes les donnees d'un capteur entre 2 dates, et les renvoie dans l'ordre de la plus ancienne a la plus recente
		$stmt = $dbh->prepare("SELECT date_time, nom, val FROM donnees, capteurs WHERE donnees.id_capteur = capteurs.id_capteur AND donnees.id_capteur LIKE :id_capteur AND date_time BETWEEN :dateDebut AND :dateFin ORDER BY date_time ASC;");
		
		switch ($_POST["capteur"]){ // selon le capteur demande, on renseigne le bon id_capteur (valeur de la base de donnees)
			case "temperature": $id_capteur = "3";break; 
			case "pression": $id_capteur = "2";break;
			case "humidite": $id_capteur = "1";break;
		}

		$stmt->bindParam(':dateFin', $dateFin);			// association de la variable $dateFin au parametre :dateFin
		$stmt->bindParam(':dateDebut', $dateDebut);		// association de la variable $dateDebut au parametre :dateDebut
		$stmt->bindParam(':id_capteur', $id_capteur);	// association de la variable $id_capteur au parametre :id_capteur 
	}

    $dateDebut = implode('-', array_reverse(explode('-', str_replace("/", "-", $_POST["dateDebut"]))))." 00:00:00"; // transforme jj/mm/YYYY en YYYY-mm-dd 00:00:00 comme renseigne dans la base
    $dateFin = implode('-', array_reverse(explode('-', str_replace("/", "-", $_POST["dateFin"]))))." 23:59:59";		// transforme jj/mm/YYYY en YYYY-mm-dd 23:59:59 comme renseigne dans la base
    $stmt->execute(); // execution de la requete preparee
	
	if ($stmt->errorCode() != 00000){ // 00000 = pas d'erreur | si il y a une erreur on l'affiche
      print_r($stmt->errorInfo());
    }

	$stmt = $stmt->fetchAll(); // on passe le resultat de la requete dans un tableau

	$cle = 0; 		// declaration de la variable cle, qui correspond a une cle (ici la date-heure) dans le json de retour
	$capteur = "";	// declaration de la variable capteur, qui correspond a une cle (ici le nom du capteur, exemple: temperature, pression ...) dans le json de retour
	$json = array();// declaration du tableau qui sera encode en json pour le retour au client

	foreach ($stmt as $key => $value) { 	// on parcours chaque ligne retournee par la requete SQL
	  foreach ($value as $key2 => $value2) {// on parcours chaque variable d'une ligne retournee par la requete SQL
	    if ($key2 == "date_time"){ $cle                  = $value2;} 			// test sur la variable pour renseigner la cle "date"
	    else if($key2 == "nom"){   $capteur              = $value2;}			// renseigne le cle "nom du capteur"
	    else if($key2 == "val"){  // renseigne la valeur du capteur
	    	
	    	if ($capteur == "dvent"){
	    	  	if ($value2 >= 390 && $value2 <= 500)		{$value2 = "N" ;}
				else if ($value2 >= 197 && $value2 <= 210)	{$value2 = "NE";}
				else if ($value2 >= 34 && $value2 <= 45)	{$value2 = "E" ;}
				else if ($value2 >= 50 && $value2 <= 76)	{$value2 = "SE";}
				else if ($value2 >= 90 && $value2 <= 120)	{$value2 = "S" ;}
				else if ($value2 >= 300 && $value2 <= 345)	{$value2 = "SO";}
				else if ($value2 >= 549 && $value2 <= 670)	{$value2 = "NO";}
				else if ($value2 >= 670 && $value2 <= 790)	{$value2 = "O" ;}
				$json[$cle][$capteur] = $value2;
	    	}else if ($capteur == "batterie"){
	    		// calcul qui permet de convertir la tension en pourcent
	    		// on ramene la tension entre 0 et 1.3 (tensionMax - tensionMin)
	    		// et on calcule le pourcentage avec un arrondi a l'unite
	    		$json[$cle][$capteur] = round((($value2-$tensionMin)*100)/($tensionMax-$tensionMin));
	    	}else{
				$json[$cle][$capteur] = floatval($value2);
	    	}
	 	}	
	  }
	}
 	
	echo json_encode($json); // affiche le tableau encode en json
	// json genere:
	/* {DATE/HEURE:{
			NOM DU CAPTEUR: VALEUR DU CAPTEUR,
			NOM DU CAPTEUR: VALEUR DU CAPTEUR, 
			...}, 
		DATE/HEURE:{
			NOM DU CAPTEUR: VALEUR DU CAPTEUR,
			NOM DU CAPTEUR: VALEUR DU CAPTEUR, 
			...}, 
		...}
	*/
}else{
	echo "Il manque des variables !";
}
?>