var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;


/* GET home page. */
router.get('/', function(req, res, next){
    req.db.collection('places').find().toArray(function(err, docs){
        if (err){
            return next(err);
        }
        res.render('index', {title: 'Travel Wish List', places: docs});
    });
});

/* GET all items home page. */
router.get('/all', function(req, res) {
    req.db.collection('places').find().toArray(function(err, docs){
        if (err){
            return next(err);
        }
        res.json(docs);
    });
});

/* POST - add a new location */
// I wanted to allow the user to add a place more than once in case they wanted to remember to visit again
router.post('/add', function(req, res) {

    var name = req.body.name;
    var place = {'name': name, 'visited': false};
    req.db.collection('places').insertOne({'name':name, 'visited':false});
    res.status(201);      // Created
    res.json(place);      // Send new object data back as JSON, if needed.

});


/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res){

    var id = req.body.id;
    var visited = req.body.visited == "visited";

    req.db.collection('places').update({"_id":ObjectId(id)}, {$set:{"visited":visited}});

    res.status(200);
    res.end();

});

/* delete a location */
router.delete('/delete', function(req, res){

  var place_id = req.body.id;

  req.db.collection('places').remove({'_id':ObjectId(place_id)});

  res.status(200);
  res.end();

});

module.exports = router;
