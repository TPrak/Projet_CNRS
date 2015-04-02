
/**
Fonction qui récupère les données du serveur via une requête HTTP, construit le graphe et l'affiche sur la page
**/
function requeteAjaxResume()
{
    
    var dateDebut = $("#dateTempDebut").val(); //date d'aujourd'hui récupérer dans le datepicker de la température
    var dateFin = $("#dateTempFin").val(); //date d'aujourd'hui récupérer dans le datepicker de la température

    $.ajax({
        url: "http://perso.imerir.com/cpy/CNRS/server_web.php", //url du serveur
        method : 'POST', //type de requête exécuté
        dataType: 'json', //type de données à recevoir
        data: 'capteur=tout'+'&dateDebut='+dateDebut+'&dateFin='+dateFin, // concatenation des paramètres de la requête
        success : function (json)
        {     
            // Définitions des options du graphe
            var options = {}; // variable où sont définis les options du graphe

            options.chart={
               
                renderTo:"graphResume", // nom de la div qui contiendra le graphe
                zoomType: 'xy', // options de zoom
            };

            // titre du graphe et ses options
            options.title= {
                text: 'Conditions météorologiques récentes'
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

            //options des axes Y
            options.yAxis= [
            { // Primary yAxis
                gridLineWidth: 0,
                title: {
                text: 'Pression',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                labels: {
                    format: '{value}bar',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite:true,
            }, // fermeture Primary yAxis

            { // Secondary yAxis
                labels: {
                    format: '{value}°C',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Temperature',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, // fermeture Secondary yAxis

            { // Tertiary yAxis
                gridLineWidth: 0,
                title: {
                    text: 'Taux d\'humidite',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value} %',
                    style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                },
                opposite: true,
            }
            ]; // fermeture Option des axes Y

            options.tooltip= {
                shared: true
            };

            //séries de données qui seront construite
            options.series= [
            
            {
                name: 'Humidite (%)',
                yAxis: 2,
                type: 'spline',
                data: [], // Tableau contenant les données de l'humidité
                tooltip: {
                    valueSuffix: '%'
                }
            },
            {
                name: 'Temperature (°C)',
                yAxis: 1,
                data: [], // Tableau contenant les données de la température
                tooltip: {
                    valueSuffix: ' °C'
                }
            },

            {
                name: 'Pression (bar)',
                type: 'spline',
                data: [],// Tableau contenant les données de la pression
                tooltip: {
                    valueSuffix: 'bar'
                }
            }

            /*{
                name: 'Pluviométrie (mm)',
                type: 'column',
                data: [], // Tableau contenant les données de la pluviométrie
                tooltip: {
                    valueSuffix: 'mm'
                }
            }*/
            ];

            //Boucle sur le json reçu de la requête HTTP
            $.each(json, function(index,value)
            {
                   //insertion des données de la température
                    if (value.temperature) //Si la donnée existe 
                        options.series[1].data.push(value.temperature); // on la met dans le tableau de données
                    else
                        options.series[1].data.push(null); // sinon on met la valeur null

                    //insertion des données de l'humidite
                     if (value.humidite) 
                        options.series[0].data.push(value.humidite);
                    else
                        options.series[0].data.push(null);

                    //insertion des données de la pression
                    if (value.pression)
                        options.series[2].data.push(value.pression);
                    else
                        options.series[2].data.push(null);
                    

                    //insertion des données de la pluviométrie
                    /*if (value.pluie)
                        options.series[3].data.push(value.pluie);
                    else
                        options.series[3].data.push(null);*/
   
                    //insertion des dates comme catégorie de l'axe X
                    options.xAxis.categories.push(index);
                
            }); // fermeture each

            chartResume = new Highcharts.Chart(options); // création du graphe 
        } // fermeture success
                 
    });// fermeture de la fonction ajax

}//fermeture de la fonction requeteAjaxResume


