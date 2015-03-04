
$(document).ready(function()
{

/*function constructGraph(container,data)
{*/
  var chart;
  var colors = ["#98DF8A", "#FFBB78", "#8C564B"];
  var options = {};
   
  options.chart = 
  {
    renderTo:"graphResume",
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
      },
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




//}
  






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
      options.series = [
        {
          name: 'temperature (°C)',
          data: []
        },
        {
          name: 'Humidite (%)',
          data: []
        },
        {
          name: 'Pression (bar)',
          yAxis: 1,
          data: []
        }
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

      var x =0;
      var y =0;
      var count = 0;
      

      $.each(json, function(index,value)
      {
        
        var theDate = new Date(parseInt(index),0,1);
        
        ///PARSAGE DES DONNEES///
        options.series[0].data.push(value.temperature);
        options.series[1].data.push(value.humidite);
        options.series[2].data.push(value.pression);
        //options.series[3].data.push(value.vent);
        options.xAxis.categories.push(index);
        
      
      });


    console.log("ahhh"+options.series[0].data[2]);
    //console.log(options.categories)
    chart = new Highcharts.Chart(options);


    }
  });



});