
$(document).ready(function()
{
  //requeteAjaxTemp();


  $("#datePluvioFin").on('change',function(){
    var dateDebut = $("#datePluvioDebut").val();
    var dateFin = $("#datePluvioFin").val();
    var today = new Date();

    if (dateDebut<= dateFin)
    {
      $("#datePluvioDebut").datepicker( "option", "maxDate", dateFin);
      $("#datePluvioFin").datepicker( "option", "minDate", dateDebut );
    }
    if (dateDebut > dateFin)
    {
      alert ('Date de début supérieure à la date de fin');
      $("#datePluvioFin").datepicker( "setDate",  dateDebut );
    }
    requeteAjaxTemp();
  });

  
  $("#datePluvioDebut").on('change',function(){
      
    var dateDebut = $("#datePluvioDebut").val();
    var dateFin = $("#datePluvioFin").val();

    if (dateDebut< dateFin)
    {
      $("#datePluvioDebut").datepicker( "option", "maxDate", dateFin);
      $("#datePluvioFin").datepicker( "option", "minDate", dateDebut );
    }

    if (dateDebut > dateFin)
    {
      alert ('Date de début supérieure à la date de fin');
      $("#dateTempDebut").datepicker( "setDate", dateFin );
    }


    requeteAjaxPluvio();
  });

});









function requeteAjaxPluvio()
{
  var dateDebut = $("#datePluvioDebut").val();
  var dateFin = $("#datePluvioFin").val();

  $.ajax(
  {
    //url: "http://localhost/projet_cnrs/Client/json/jsonTest.html",
    url: "http://perso.imerir.com/cpy/CNRS/server_web.php",
    method : 'POST',
    dataType: 'json', 
    data: 'capteur=pluie'+'&dateDebut='+dateDebut+'&dateFin='+dateFin, // on envoie $_GET['id_region']

    success : function (json)
    {
                  var options = {}; // variable où sont définis les options du graphe

            options.chart={
               
                renderTo:"graphPluviometrie",
                zoomType: 'xy',
            };
            options.title= {
                text: 'Evolution de la pluviométrie du '+dateDebut+' au '+dateFin,
            };
            options.subtitle= {
                text: 'Source: Station météo de la Tour Massane'
            };
        
            options.xAxis= {
                    categories: [],
                    crosshair: true
            };



            //Options des axes Y
            options.yAxis= [
            {// Secondary yAxis
                labels: {
                    format: '{value} mm',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Pluviométrie',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            } // fermeture Secondary yAxis

            ]; // fermeture Option des axes Y

            options.tooltip= {
                shared: true
            };

            options.legend= {
                layout: 'horizontal',
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 55,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            }

            options.series= [
            {
                name: 'Pluviométrie (mm)',
                type: 'column',
                data: [],
                tooltip: {
                    valueSuffix: ' mm'
                }
            }];

            //Boucle sur le json reçu de la requête HTTP
            $.each(json, function(index,value)
            {               
                    if (value.pluie)
                        options.series[0].data.push(value.pluie);
                    else
                        options.series[0].data.push(null);

                    options.xAxis.categories.push(index);
                
            }); // fermeture each json
    
            var chartPluvio = new Highcharts.Chart(options); // création du graphe 
        } // fermeture success
  });

}


