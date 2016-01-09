// message saver.js
var db = require('./db.js');




function GetInputData(message){
	var split = message.split(';');
	var inputdata = {
		ip: split[0].trim(),
		mac: split[1].trim(),
		ubicacion: split[2].trim(),
		timestamp: split[3],
		dato1: split[4],
		dato2: split[5]
	};
	return inputdata;
}

function SaveToDB(message){
	var inputdata = GetInputData(message);
	var query = "INSERT INTO `datos`(`dat_fechahora`, `dat_ubicacion`, `dat_mac`, `dat_ip`, `dat_dato1`, `dat_dato2`) ";
	query += "VALUES ('"+inputdata.timestamp+"','"+inputdata.ubicacion+"','"+inputdata.mac+"','"+inputdata.ip+"', ";
	query +=inputdata.dato1+","+inputdata.dato2+")";
	console.log(query);
	db.QueryDB(query, function(){});

}

exports.SaveToDB = SaveToDB;




















