// JavaScript 
	

$(document).ready(function () {
 $.ajax({
    url: 'http://www.highcharts.com/samples/data/jsonp.php?filename=range.json&callback=?',
    type: 'GET',
    async: true,
    dataType: "json",
    success: function (data) {
        displayDataT(data);
		displayDataH(data);
    }
  });
 });
 
 
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


 function displayDataH (data) {
$('#graphHumi').highcharts({
        chart: {
            type: 'spline' 
        },
        title: {
            text: 'Humidité'
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
		        name: 'Humidite',
		        data: data,
		        color: '#FF0000',
		        negativeColor: '#0088FF'
		    }],
  });
}