
$(document).ready(function()
{
    //Fonction exécuté lors du changement de la date de fin du graphe Pression
  $("#dateDVentFin").on('change',function(){
    var dateDebut = $("#dateDVentDebut").val();//récupération de la date de début de l'autre datepicker
    var dateFin = $("#dateDVentFin").val();//récupération de la date du datepicker changé

    if (dateDebut<= dateFin)
    {
      $("#dateDVentDebut").datepicker( "option", "maxDate", dateFin);// la date maximum du datepicker de début sera celle du datepicker de fin
      $("#dateDVentFin").datepicker( "option", "minDate", dateDebut );// la date minimim du datepicker de dfin sera celle du datepicker de début
      requeteAjaxDVent();// On lance la requête pour la construction du graphe
    }
    if (dateDebut > dateFin)//Au chargement si on prend une date de fin plus haute que celle d'aujourd'hui
    {
      alert ('Date de début supérieure à la date de fin');//pop-up d'avertissement
      $("#dateDVentFin").datepicker( "setDate",  dateDebut );//on remet la date au même jour que l'autre datepicker
    }
    
  });

  //Fonction exécuté lors du changement de la date de début du graphe Pression
  $("#dateDVentDebut").on('change',function(){
      
    var dateDebut = $("#dateDVentDebut").val();//récupération de la date de début de l'autre datepicker
    var dateFin = $("#dateDVentFin").val();//récupération de la date du datepicker changé

    if (dateDebut< dateFin)
    {
      $("#dateDVentDebut").datepicker( "option", "maxDate", dateFin);// la date maximum du datepicker de début sera celle du datepicker de fin
      $("#dateDVentFin").datepicker( "option", "minDate", dateDebut );// la date minimim du datepicker de dfin sera celle du datepicker de début
      requeteAjaxDVent();// On lance la requête pour la construction du graphe
    }

    if (dateDebut > dateFin)//Au chargement si on prend une date de début plus haute que celle d'aujourd'hui
    {
      alert ('Date de début supérieure à la date de fin');//pop-up d'avertissement
      $("#dateDVentDebut").datepicker( "setDate", dateFin );//on remet la date au même jour que l'autre datepicker
    } 
  });
});

//Fonction éxécutant une requête ajax pour récupérer les données en json et construire un graphe highcharts
function requeteAjaxDVent()
{
    //récupération des dates
    var dateDebut = $("#dateDVentDebut").val();
    var dateFin = $("#dateDVentFin").val();

    $.ajax(
    {
        url: "http://perso.imerir.com/cpy/CNRS/server_web.php",//url du serveur
        method : 'POST',//type de requête exécuté
        dataType: 'json',//type de données à recevoir 
        data: 'capteur=dvent'+'&dateDebut='+dateDebut+'&dateFin='+dateFin,// concatenation des paramètres de la requête
    
        success : function (json)
        {
            var options = {}; // variable où sont définis les options du graphe
    
            options.chart={
                renderTo:"graphDVent",// nom de la div qui contiendra le graphe
                type: 'bubble',
                zoomType: 'xy',// options de zoom
            };

            // titre du graphe et ses options
            options.title= {
                text: 'Evolution de la direction du vent du '+dateDebut+' au '+dateFin,
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
                type: 'category',
                categories: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'NO', 'O'],
                title: {
                    text: null //'Kierunki'
                },
                min: 0,
                max: 7
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
                name: 'Force du vent (km/h)',
                color: '#DF6F00',
                sizeBy: 'width',
                data: [],
                tooltip: {
                    valueSuffix: ' km/h ',
                }
            }];
            
            var dataForce=[];
            var dataDirection=[];
          
          console.log("aaaaaa");
            //Boucle sur le json reçu de la requête HTTP
            $.each(json, function(index,value)
            {
                console.log("x"+value.dvent + " "+ value.fvent);
  
                dataDirection.push(value.dvent);
                dataForce.push(value.fvent);
                    

                 options.series[0].data.push([value.dvent , value.fvent]);

                //insertion des dates comme catégories de l'axe X
                 options.xAxis.categories.push(index);  
                

            }); // fermeture each json

            var chartDVent = new Highcharts.Chart(options); // création du graphe 
        } // fermeture success
    });// fermeture de la fonction ajax
}//fermeture de la fonction requeteAjaxDVent





