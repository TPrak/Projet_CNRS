
$(document).ready(function()
{

    //Barre de navigation collante
    rocket = $('#navbar');// Stockage des références des différents éléments dans des variables
    fixedLimit = rocket.offset().top - parseFloat(rocket.css('marginTop').replace(/auto/,0));// Calcul de la marge entre le haut du document et #navigation
    $(window).trigger('scroll');// On déclenche un événement scroll pour mettre à jour le positionnement au chargement de la page 
    $(window).scroll(function(event){      
      windowScroll = $(window).scrollTop();// Valeur de défilement lors du chargement de la page
      if( windowScroll >= fixedLimit ){rocket.addClass('navbar-fixed-top');}else{rocket.removeClass('navbar-fixed-top');}// Mise à jour du positionnement en fonction du scroll
    });


  // Chargement des dates au démarrage
  jQuery(function($){
    $('.datepicker').datepicker({
      dateFormat : 'dd/mm/yy',
      maxDate: 0,
    });
 
    $(".datepicker").datepicker(); // initialisation des datepicker
    $(".datepicker").datepicker('setDate' , new Date()); // mises des dates à aujourd'hui
    $('#dateTempFin').datepicker('option','minDate' , new Date()); //blocage des dates de fin à aujourd'hui
    $('#datePressionFin').datepicker('option', 'minDate' , new Date()); 
    $('#dateHumiFin').datepicker('option', 'minDate' , new Date());
    $('#datePluvioFin').datepicker('option', 'minDate' , new Date());
    $('#dateFVentFin').datepicker('option', 'minDate' , new Date());
    $('#dateDVentFin').datepicker('option', 'minDate' , new Date());
  });

  //Import de script js et chargement des graphes au démarrage
  $.getScript("js/graphResume.js", function(){
    requeteAjaxResume();;
  })

  $.getScript("js/graphBatterie.js", function(){
    requeteAjaxBatterie();
  })
  
  $.getScript("js/graphTemperature.js", function(){
    requeteAjaxTemp();
  });

  $.getScript("js/graphPression.js", function(){
    requeteAjaxPression();
  })

  $.getScript("js/graphHumidite.js", function(){
    requeteAjaxHumidite();
  })

  $.getScript("js/graphPluviometrie.js", function(){
    requeteAjaxPluvio();
  })

  $.getScript("js/graphFVent.js", function(){
    requeteAjaxFVent();
  })

  $.getScript("js/graphDVent.js", function(){
    requeteAjaxDVent();
  })
  
  
}); 
