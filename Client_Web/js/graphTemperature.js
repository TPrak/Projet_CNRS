
  var chartTemperature;
  var colors = ["#98DF8A", "#FFBB78", "#8C564B"];
  var options = {};
   
  options.chart = 
  {
    renderTo:"graphTemperature",
    width: 588,
    height: 400,
    marginTop: 70,
    marginLeft: 100,
    marginRight: 100,
    type:'line'
  };
   
  options.credits = 
  {
    enabled: false
  };
   
  options.colors = colors;
   
  options.title = 
  {
    text: "Évolution des conditions météorologiques",
    margin: 10
  };
   

  options.yAxis = 
  [{
      title : 
      {
        text: "Température (°C)"

      labels: 
      {
        formatter: function() 
        {
          return this.value +' °C';
        },
        style: 
        {
          color: '#000'
        }
      }
    },
    
    {
      title: 
      {
        text: "Bar"
      },
      labels: 
      {
        formatter: function() 
        {
          return this.value;
        },
        style: 
        {
          color: '#8C564B'
        }
      },
      opposite: true
    }
  ];
  
  options.xAxis = 
  {
    categories: [],
    labels: {
    rotation: -45,
    y: 20
  }

};



document).ready(function()
{

}


function requeteAjax()
{
	$.ajax(
  {
    //url: "http://localhost/projet_cnrs/Client/json/jsonTest.html",
    url: "http://perso.imerir.com/cpy/CNRS/server_web.php",
    dataType: 'json',
    method : 'GET',

    success : function (json)
    {
      //for debug
      console.log("json: "+ json);
      
      ///////RECEPTION DES DONNEES //////
      options.series = 
      [
        {
          name: 'temperature (°C)',
          data: []
        },
      ]


      options.tooltip = 
       {
         formatter: function() 
         {
           animation: true;
           //return "Dépense : " ;
           shared: true;
           crosshairs: true;
           
             return this.y;
         }
       };
   
      $.each(json, function(index,value)
      {
        
        var theDate = new Date(parseInt(index),0,1);
        
        ///PARSAGE DES DONNEES///
        options.series[0].data.push(value.temperature);
        //options.series[3].data.push(value.vent);
        options.xAxis.categories.push(index);
        
      
     });


    console.log("ahhh"+options.series[0].data[2]);
    //console.log(options.categories)
    chart = new Highcharts.Chart(options);


    }
  });

}