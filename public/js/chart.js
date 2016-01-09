var Ubicacion = "Pucon";
var IsShowingCurrentData = null;
var dataPoints1 = [];
var chart;

function StartChart(inputdata){

	chart = new CanvasJS.Chart("chartContainer",
	{
		title:{
			text: "Solmaforo: " + inputdata.ubicacion,
			fontSize: 30
		},
		animationEnabled: true,
		axisX:{

			gridColor: "Silver",
			tickColor: "silver",
			valueFormatString: "DD-MM-YY HH:mm:ss"

		},
		toolTip:{
			shared:true
		},
		theme: "theme2",
		axisY: {
			gridColor: "Silver",
			tickColor: "silver"
		},
		legend:{
			verticalAlign: "center",
			horizontalAlign: "right"
		},
		data: [
		{
			type: "line",
			showInLegend: true,
			lineThickness: 2,
			name: "Radiacion",
			markerType: "square",
			color: "#F08080",
			dataPoints: inputdata.dataPoints1
		},
		{
			type: "line",
			showInLegend: false,
			visible: false,
			name: "Unique Visits",
			color: "#20B2AA",
			lineThickness: 2,
			
			dataPoints: [
			{ x: new Date(2010,0,3), y: 510 },
			{ x: new Date(2010,0,5), y: 560 },
			{ x: new Date(2010,0,7), y: 540 },
			{ x: new Date(2010,0,9), y: 558 },
			{ x: new Date(2010,0,11), y: 544 },
			{ x: new Date(2010,0,13), y: 693 },
			{ x: new Date(2010,0,15), y: 657 },
			{ x: new Date(2010,0,17), y: 663 },
			{ x: new Date(2010,0,19), y: 639 },
			{ x: new Date(2010,0,21), y: 673 },
			{ x: new Date(2010,0,23), y: 660 }
			]
		}

		
		],
		legend:{
			cursor:"pointer",
			itemclick:function(e){
				if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				}
				else{
					e.dataSeries.visible = true;
				}
				chart.render();
			}
		}
	});

	chart.render();
}

function CreateChartInput(data){
	for (var i=0; i<data.length; i++){
		dataPoints1.push({
			x: new Date(data[i].dat_fechahora),
			y: data[i].dat_dato1
		});
	}

	var inputdata = {
		ubicacion: Ubicacion,
		dataPoints1: dataPoints1
	};
	return inputdata;
}

function StartShowingCurrentData(){
	IsShowingCurrentData = true;
	$.ajax({
		url: '/api/getLastDayData', 
		method: "GET",
		data: {ubicacion : Ubicacion}
		}).done(function(data) {
			var inputdata = CreateChartInput(data);
			StartChart(inputdata);

		})
		.error(function(data) {
			console.log('Error: ' + data);
	});
	setInterval(function() {
		ShowNewData();
	}, 1000 * 6 * 1);
}

function ShowDataForDate(thedate){
	IsShowingCurrentData = false;
	$.ajax({
		url: '/api/getDataForDate', 
		method: "GET",
		data: {
			fecha : thedate,
			ubicacion : Ubicacion
		}
	}).done(function(data) {
			var inputdata = CreateChartInput(data);
			StartChart(inputdata);
	})
	.error(function(data) {
			console.log('Error: ' + data);
	});
}

function ShowNewData(){
	if (IsShowingCurrentData){
		var tiempo = new Date();
		if (dataPoints1.length > 0){
			tiempo = dataPoints1[dataPoints1.length-1].x
		}
		$.ajax({
			url: '/api/getLastData', 
			method: "GET",
			data: {
				ubicacion : Ubicacion,
				ultimoTiempo : tiempo
			}
			}).done(function(data) {

				for (var i=0;i<data.length;i++){
					var newdatapoint = {
						x: new Date(data[i].dat_fechahora),
						y: data[i].dat_dato1
					}
					chart.options.data[0].dataPoints.push(newdatapoint);
				}
				chart.render();
			})
			.error(function(data) {
				console.log('Error: ' + data);
		});
	}
}

window.onload = function () {
	StartShowingCurrentData();

};

$('#btnRefresh').on('click', function(){
	var checkedRadio = $('input[name=dia_ver_datos]:checked', '#verdatosform').val();
	if (checkedRadio=="today"){
		StartShowingCurrentData();
	}
	else{
		var thedate = $('#date_ver_datos').datepicker( "getDate" );
		ShowDataForDate(thedate);
	}
	return false;
});












