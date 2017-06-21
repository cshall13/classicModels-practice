var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var serverInfo = require('../config/config');


var connection = mysql.createConnection({
	host: serverInfo.host,
	user: serverInfo.username,
	password: serverInfo.password,
	database: serverInfo.database
});
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	var products = [];
	var selectQuery = 'SELECT productLine FROM productlines';
	connection.query(selectQuery, (error,results)=>{
		if(error) throw error;
		products = results;
		console.log(products[2].productLine)
  	res.render('index', { products: products });
	});
});





module.exports = router;
