function MaJProgressBar(val){

  item = $('#ProgressBar');// Stockage des références des différents éléments dans des variables
  
  if(val <= 20)
  {
    item.addClass('progress-bar-danger  progress-bar-striped active');
    item.text(val+"%");
  }else{
    item.removeClass('progress-bar-danger  progress-bar-striped active');
    item.text(val+"%");
  }
  item.css("width", val+"%"); 
} 

function requeteAjaxBatterie()
{
  $.ajax(
  {
    url: "http://perso.imerir.com/cpy/CNRS/server_web.php",
    method : 'POST',
    dataType: 'json', 
    data: 'capteur=batterie&dateDebut=0&dateFin=0',

    success : function (json)
    {
      $.each(json, function(index,value)
      {
        MaJProgressBar(value.batterie);
      });
    },
     error : function(resultat, statut, erreur){
      console.log("resultat: "+resultat);
      console.log("statut: "+statut);
      console.log("erreur: "+erreur);
    }
  });

}


