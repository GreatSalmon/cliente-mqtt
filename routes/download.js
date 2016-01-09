var db = require('./db.js');

function DownloadData(input, callback){
	console.log(input);
	var endDate = new Date(input.date_end);
	endDate.setDate(endDate.getDate() + 1);

	var query = "select dat_fechahora, dat_dato1, dat_dato2 from datos where ";
	query += "dat_ubicacion = '"+input.ubicacion+"'";
	query += " and dat_fechahora > '" + new Date(input.date_start).toString('yyyy-MM-dd HH:mm:ss') + "'";
	query += " and dat_fechahora < '" + endDate.toString('yyyy-MM-dd HH:mm:ss') + "'";
	console.log(query);
	db.QueryDB(query, function(err,rows){
		if(!err) {
			var text = "fecha; datos\n";
			for (var i=0; i<rows.length; i++){
				text+= rows[i].dat_fechahora.toString('yyyy-MM-dd HH:mm:ss') + ";" + rows[i].dat_dato1 + ";" + rows[i].dat_dato2 + "\n";
			}
			var filename = "Solmaforo " + input.ubicacion + " ";
			filename += input.date_start.toString('yyyy-MM-dd') + " - " + endDate.toString('yyyy-MM-dd') + ".dat";
			callback(null, filename,text);
		}
		else{
			console.log(err);
			callback(err);
		}
	});


}

exports.DownloadData = DownloadData;