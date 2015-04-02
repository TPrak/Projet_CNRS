 
$(document).ready(function()
{
    //Fonction exécuté lors du changement de la date de fin du graphe Humidité
    $("#dateHumiFin").on('change',function(){
        var dateDebut = $("#dateHumiDebut").val(); //récupération de la date de début de l'autre datepicker
        var dateFin = $("#dateHumiFin").val(); //récupération de la date du datepicker changé
 
        if (dateDebut<= dateFin) 
        {
            $("#dateHumiDebut").datepicker( "option", "maxDate", dateFin); // la date maximum du datepicker de début sera celle du datepicker de fin
            $("#dateHumiFin").datepicker( "option", "minDate", dateDebut );// la date minimim du datepicker de dfin sera celle du datepicker de début
            requeteAjaxHumidite(); // On lance la requête pour la construction du graphe
        }
        if (dateDebut > dateFin) //Au chargement si on prend une date de fin plus haute que celle d'aujourd'hui
        {
            alert ('Date de début supérieure à la date de fin');  //pop-up d'avertissement
            $("#dateHumiFin").datepicker( "setDate",  dateDebut ); //on remet la date au même jour que l'autre datepicker
        }
       
    });

  //Fonction exécuté lors du changement de la date de début du graphe Humidité
    $("#dateHumiDebut").on('change',function(){
      
        var dateDebut = $("#dateHumiDebut").val();//récupération de la date de début de l'autre datepicker
        var dateFin = $("#dateHumiFin").val(); //récupération de la date du datepicker changé
    
        if (dateDebut< dateFin)
        {
          $("#dateHumiDebut").datepicker( "option", "maxDate", dateFin); // la date maximum du datepicker de début sera celle du datepicker de fin
          $("#dateHumiFin").datepicker( "option", "minDate", dateDebut );// la date minimim du datepicker de dfin sera celle du datepicker de début
          requeteAjaxHumidite();// On lance la requête pour la construction du graphe
        }
        if (dateDebut > dateFin)//Au chargement si on prend une date de début plus haute que celle d'aujourd'hui
        {
          alert ('Date de début supérieure à la date de fin');//pop-up d'avertissement
          $("#dateHumiDebut").datepicker( "setDate", dateFin );//on remet la date au même jour que l'autre datepicker
        }

    });

});
 

//Fonction éxécutant une requête ajax pour récupérer les données en json et construire un graphe highcharts
function requeteAjaxHumidite()
{
    //récupération des dates 
    var dateDebut = $("#dateHumiDebut").val(); 
    var dateFin = $("#dateHumiFin").val();  

    $.ajax({
        url: "http://perso.imerir.com/cpy/CNRS/server_web.php", //url du serveur
        method : 'POST', //type de requête exécuté
        dataType: 'json', //type de données à recevoir
        data: 'capteur=humidite'+'&dateDebut='+dateDebut+'&dateFin='+dateFin, // concatenation des paramètres de la requête
    
        success : function (json)
        {
            var options = {}; // variable où sont définis les options du graphe
            
            // Définitions des options du graphe
            options.chart={
               
                renderTo:"graphHumidite", // nom de la div qui contiendra le graphe
                zoomType: 'xy', // options de zoom
            };

            // titre du graphe et ses options
            options.title= {
                text: 'Evolution de l\'humidité du '+dateDebut+' au '+dateFin,
            };

            // sous-titre du graphe
            options.subtitle= {
                text: 'Source: Station météo de la Tour Massane'
            };
            
            // options de l'axe X
            options.xAxis= {
                    categories: [],
                    crosshair: true
            };
    
            //Options des axes Y
            options.yAxis= [
            {// Primary yAxis
                labels: {
                    format: '{value} %',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Taux d\'humidité',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            } // fermeture Primary yAxis
            ]; // fermeture Option des axes Y
    
            options.tooltip= {
                shared: true
            };
            
            //options de la légende du graphe
            options.legend= {
                layout: 'vertical', // type d'alignement
                align: 'left', //positionnement
                x: 80,
                verticalAlign: 'top', //positionnement
                y: 55,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            }
            
            //série de données qui sera construite
            options.series= [
            {
                name: 'Humidite (%)',
                data: [], // Tableau contenant les données de l'humidité
                tooltip: {
                    valueSuffix: ' %'
                }
            }];
    
            //Boucle sur le json reçu de la requête HTTP
            $.each(json, function(index,value)
            {    
                //insertion des données de l'humidité
                if (value.humidite)//Si la donnée existe
                    options.series[0].data.push(value.humidite); // on la met dans le tableau de données
                else
                    options.series[0].data.push(null);// sinon on met la valeur null
                options.xAxis.categories.push(index);
            }); // fermeture each json
          
            // création du graphe 
            var chartHumidite = new Highcharts.Chart(options); // création du graphe 
        } // fermeture success
    }); // fermeture de la fonction ajax
} //fermeture de la fonction requeteAjaxHumidite


