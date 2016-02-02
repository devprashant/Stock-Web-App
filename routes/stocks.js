var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a stock');
});

/**
 * Stock Listing
 */
router.get('/lstock', function(req, res){
	var db =req.db;
	var collection = db.get("cloudStocks");
	collection.find({}, {}, function(e, docs){
			res.json(docs);
	});
	
});

/**
 * Stock Creating
 */
router.post('/cstock', function(req, res){
	var db =req.db;
	var collection = db.get("cloudStocks");
	collection.insert(req.body, function(err, result){
		res.send(
				( err === null ) ? { msg: ""} : { msg: err}
			);
	});
});
/**
 * Stock Updating
 */
router.post('/ustock/:id', function(req, res){
	var db =req.db;
	var collection = db.get("cloudStocks");
	var id = req.params.id;
	collection.update(id, req.body, function(err, result){
		if (err) throw err;
		res.send(
				( err === null ) ? { msg: ""} : { msg: err}
			);
	});
});
/**
 * Stock Deleting
 */
router.delete('/dstock/:id', function(req, res){
	var db =req.db;
	var collection = db.get("cloudStocks");
	var stockToDelete = req.params.id;
	collection.remove({
			'_id': stockToDelete
	}, function(err){
		res.send(
				( err === null ) ? { msg: ""} : { msg: err}
			);
	});
});

module.exports = router;
