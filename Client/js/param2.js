// JavaScript 

$(document).ready(function() {
	
var chart;
var colors = ["#98DF8A", "#FFBB78", "#8C564B"];
var options = {};
 
 /**************************** Parametres du graph*/
options.chart = {
  renderTo: 'graphGen',
  width: 588,
  height: 400,
  marginTop: 70,
  marginLeft: 100,
  marginRight: 100,
  type:'line'
};
 
options.credits = {
  enabled: false
};
 
options.colors = colors;
 
options.title = {
  text: "Station météo",
  margin: 10
};
 
options.tooltip = {
  formatter: function() {
    return "Mesure : " + number_format(this.y,3,',',' ') + "C°" ;
  }
};	

/****************************** Parametres des Y*/

options.yAxis = [
  {
    title : {
      text: "Gazoil &amp; Super 95 (€)"
    },
    labels: {
    formatter: function() {
      return this.value +' €';
    },
    style: {
      color: '#000'
    }
  }
  },{
  title: {
    text: "Baryl brent ($US)"
  },
  labels: {
    formatter: function() {
      return this.value +' $';
    },
    style: {
      color: '#8C564B'
    }
  },
  opposite: true
}];
  
/*********************************** Parametres des X*/

 options.xAxis = {
  categories: [],
  labels: {
    rotation: -45,
y: 20
  }
};
 
 /*********************************** Gestion des séries */
  
options.series = [
  {
    name: 'temperature (C°)',
    data: []
  },
  {
    name: 'Pression (hP)',
    data: []
  },
  {
    name: 'Humidité (%)',
    data: []
  }
]/*********************************** Recupération du json et parsage*/

$.getJSON('http://perso.imerir.com/jsabbatier/test/fuckjson.html', function(mesure) {
 
    $.each(mesure, function(i,e){
 
      var theDate = new Date(parseInt(i),0,1);
 
      options.series[0].data.push(e.temperature);
      options.series[1].data.push(e.humidite);
      options.series[2].data.push(e.pression);
      options.xAxis.categories.push(i);
 
    })
    console.log(options.categories)
    chart = new Highcharts.Chart(options);
 
  });



 /*
 function displayDataT (data) {
$('#graphTemp').highcharts({
        chart: {
            type: 'spline' 
        },
        title: {
            text: 'Température'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Degrés'
            }
        },
		tooltip: {
		        crosshairs: true,
		        shared: true,
		        valueSuffix: '°C'
		},
		credits: {
  			enabled: false
		},
        series: [{
		        name: 'Temperatures',
		        data: data,
		        color: '#FF0000',
		        negativeColor: '#0088FF'
		    }],
  });
}
*/

});