function ErrorFunction(err){
	console.log("ERROR");
	console.log(err.message);
	console.log(err);
	//res.json({"code" : 100, "status" : "Error in connection database " + err});
}

exports.ErrorFunction = ErrorFunction;