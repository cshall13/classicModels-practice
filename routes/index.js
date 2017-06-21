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
  	res.render('index', { products: products });
	});
});

router.get('/products', function(req, res, next) {
	var productLine = req.query.msg;
	var productNames = [];
	var productQuery = `SELECT productName FROM products WHERE productLine = '${productLine}';`;
	connection.query(productQuery, (error,results)=>{
		if(error) throw error;
		for(i = 0; i < results.length;i++)
			productNames.push(results[i].productName)	
  				res.render('products', { productNames: productNames });
	});
});


router.get('/product_info', function(req, res, next) {
	function getProductInfo(){
		productName = req.query.msg;
		var productInfoQuery = `SELECT * FROM products WHERE productName = '${productName}';`;
		return new Promise((resolve,reject)=>{
			connection.query(productInfoQuery, function (error,results){
				if(error) throw error;
				resolve(results[0]);
			});
		});
	}

	function getOrderInfo(productCode){
		var orderInfoQuery = `SELECT * FROM orderdetails WHERE productCode = '${productCode}';`;
		return new Promise((resolve,reject)=>{
			connection.query(orderInfoQuery, function (error,results){
				if(error) throw error;
				resolve(results);
			});
		});
	}
	

getProductInfoPromise = getProductInfo();
getProductInfoPromise.then((data)=>{
	productInfo = data;
	var productCode = productInfo.productCode;
	return getOrderInfo = getOrderInfo(productCode);
	console.log(productInfo.productCode);
	
	}).then((data)=>{
		var orderInfo = data;
		console.log(orderInfo);
		res.render('product_info', {productInfo: productInfo, orderInfo: orderInfo})
	})
});


module.exports = router;
