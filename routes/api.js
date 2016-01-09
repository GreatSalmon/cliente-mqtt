/* Note: All routing in this page comes preceded with /api/
 Example: to call allcuisines, send GET to /api/allcuisines
*/

var express = require('express');
var router = express.Router();
var db = require('./db.js');
var datejs = require('datejs');
var Error = require('./error.js');
var SendEmail = require('./sendemail.js');
var mqtt_client = require('./mqtt-client.js');
var download = require('./download.js');
var ua = require('universal-analytics');
var http = require('http');

//var Sequelize = require('sequelize');
//var sequelize = new Sequelize('tablegetter', 'root');



router.get('/getLastDayData', function(req,res) {
	var query = "select dat_fechahora, dat_dato1, dat_dato2 from datos where dat_ubicacion = '"+req.query.ubicacion+"'";
	query += " and dat_fechahora > '" + (new Date()).toString('yyyyMMdd')+ "'";
	db.QueryDB(query, function(err,rows){
		if(!err) {
			console.log(rows);
			res.json(rows);
		}
		else{
			console.log(err);
			res.json({"code" : 100, "status" : "Error in connection to database: " + err});
		}
	});
});

router.get('/getLastData', function(req,res) {

	var query = "select dat_fechahora, dat_dato1, dat_dato2 from datos where ";
	query += "dat_ubicacion = '"+req.query.ubicacion+"'";
	query += " and dat_fechahora > '" + new Date(req.query.ultimoTiempo).toString('yyyy-MM-dd HH:mm:ss') + "'";
	console.log(query);
	db.QueryDB(query, function(err,rows){
		if(!err) {
			console.log(rows);
			res.json(rows);
		}
		else{
			console.log(err)
			res.json({"code" : 100, "status" : "Error in connection to database: " + err});
		}
	});
});

router.get('/getDataForDate', function(req,res) {
	var fecha = new Date(req.query.fecha);
	var manana = new Date(req.query.fecha);
	manana.setDate(manana.getDate() + 1);

	var query = "select dat_fechahora, dat_dato1, dat_dato2 from datos where ";
	query += "dat_ubicacion = '"+req.query.ubicacion+"'";
	query += " and dat_fechahora > '" + fecha.toString('yyyy-MM-dd HH:mm:ss') + "'";
	query += " and dat_fechahora < '" + manana.toString('yyyy-MM-dd HH:mm:ss') + "'";
	console.log(query);
	db.QueryDB(query, function(err,rows){
		if(!err) {
			console.log(rows);
			res.json(rows);
		}
		else{
			console.log(err)
			res.json({"code" : 100, "status" : "Error in connection to database: " + err});
		}
	});


});




router.get('/listenToTopic', function(req,res) {
	mqtt_client.StartListeningToTopic();
});



/**
 * Entry point for the /api/sendemail POST call
 * Sends an "Contact us" email to tablegetter team
 */
router.post('/download', function(req,res){
	download.DownloadData(req.body, function(err, filename, text){
		if (err){
			res.json({"code" : 100, "status" : "Error in connection to database: " + err});
		}
		else{
			res.writeHead(200, {'Content-Type': 'application/force-download','Content-disposition':'attachment; filename='+filename});
			res.end(text);
		}
		
	});


});



module.exports = router;
