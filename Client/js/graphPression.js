
$(document).ready(function()
{
    //Fonction exécuté lors du changement de la date de fin du graphe Pression
  $("#datePressionFin").on('change',function(){
    var dateDebut = $("#datePressionDebut").val();//récupération de la date de début de l'autre datepicker
    var dateFin = $("#datePressionFin").val();//récupération de la date du datepicker changé

    if (dateDebut<= dateFin)
    {
      $("#datePressionDebut").datepicker( "option", "maxDate", dateFin);// la date maximum du datepicker de début sera celle du datepicker de fin
      $("#datePressionFin").datepicker( "option", "minDate", dateDebut );// la date minimim du datepicker de dfin sera celle du datepicker de début
      requeteAjaxPression();// On lance la requête pour la construction du graphe
    }
    if (dateDebut > dateFin)//Au chargement si on prend une date de fin plus haute que celle d'aujourd'hui
    {
      alert ('Date de début supérieure à la date de fin');//pop-up d'avertissement
      $("#datePressionFin").datepicker( "setDate",  dateDebut );//on remet la date au même jour que l'autre datepicker
    }
    
  });

  //Fonction exécuté lors du changement de la date de début du graphe Pression
  $("#datePressionDebut").on('change',function(){
      
    var dateDebut = $("#datePressionDebut").val();//récupération de la date de début de l'autre datepicker
    var dateFin = $("#datePressionFin").val();//récupération de la date du datepicker changé

    if (dateDebut< dateFin)
    {
      $("#datePressionDebut").datepicker( "option", "maxDate", dateFin);// la date maximum du datepicker de début sera celle du datepicker de fin
      $("#datePressionFin").datepicker( "option", "minDate", dateDebut );// la date minimim du datepicker de dfin sera celle du datepicker de début
      requeteAjaxPression();// On lance la requête pour la construction du graphe
    }

    if (dateDebut > dateFin)//Au chargement si on prend une date de début plus haute que celle d'aujourd'hui
    {
      alert ('Date de début supérieure à la date de fin');//pop-up d'avertissement
      $("#datePressionDebut").datepicker( "setDate", dateFin );//on remet la date au même jour que l'autre datepicker
    } 
  });
});

//Fonction éxécutant une requête ajax pour récupérer les données en json et construire un graphe highcharts
function requeteAjaxPression()
{
    //récupération des dates
    var dateDebut = $("#datePressionDebut").val();
    var dateFin = $("#datePressionFin").val();

    $.ajax(
    {
        url: "http://perso.imerir.com/cpy/CNRS/server_web.php",//url du serveur
        method : 'POST',//type de requête exécuté
        dataType: 'json',//type de données à recevoir 
        data: 'capteur=pression'+'&dateDebut='+dateDebut+'&dateFin='+dateFin,// concatenation des paramètres de la requête
    
        success : function (json)
        {
            var options = {}; // variable où sont définis les options du graphe
    
            options.chart={
                renderTo:"graphPression",// nom de la div qui contiendra le graphe
                zoomType: 'xy',// options de zoom
            };

            // titre du graphe et ses options
            options.title= {
                text: 'Evolution de la pression du '+dateDebut+' au '+dateFin,
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
                    format: '{value} bar',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Pression',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            } // fermeture Primary yAxis
            ]; // fermeture Option des axes Y
    
            options.tooltip= {
                shared: true
            };
    
            options.legend= {
                layout: 'vertical',
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 55,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            }
    
            //série de données qui sera construite
            options.series= [
            {
                name: 'Pression (bar)',
                data: [],
                tooltip: {
                    valueSuffix: ' bar'
                }
            }];
    
            //Boucle sur le json reçu de la requête HTTP
            $.each(json, function(index,value)
            {
                //insertion des données de la pression
                if (value.pression)//Si la donnée existe
                    options.series[0].data.push(value.pression);// on la met dans le tableau de données
                else
                    options.series[0].data.push(null); // sinon on met la valeur null

                //insertion des dates comme catégories de l'axe X
                options.xAxis.categories.push(index);
            }); // fermeture each json
            var chartPression = new Highcharts.Chart(options); // création du graphe 
        } // fermeture success
    });// fermeture de la fonction ajax
}//fermeture de la fonction requeteAjaxPression





