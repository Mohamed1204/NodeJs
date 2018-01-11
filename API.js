const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const path = __dirname + '/public/'; // path til mappen, + public da html filer ligger i public mappen

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('wwwroot'));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const mongodburl = 'mongodb://mooz321:zbalezbale@cluster0-shard-00-00-fpxig.mongodb.net:27017,cluster0-shard-00-01-fpxig.mongodb.net:27017,cluster0-shard-00-02-fpxig.mongodb.net:27017/ligeGyldig?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';



// READ (all)
app.get('/API/Movies', function (req, res) {
    MongoClient.connect(mongodburl, function (err, db) {

        var col = db.collection('Movies');
        // Read All
        col.find().toArray(function (err, result) {
            //console.log(result);
            res.json(result);
        });
        db.close();
    });
});
// READ (one)
app.get('/API/Movies/:id', function (req, res) {

    MongoClient.connect(mongodburl, function (err, db) {
        var col = db.collection('Movies');

        col.findOne({ '_id': ObjectId(req.params.id) }, function (err, result) {
            res.json(result);
        })
        db.close();
    });
});

// DELETE
app.delete('/API/Movies/:id', function (req, res) {
    
        MongoClient.connect(mongodburl, function (err, db) {
            var col = db.collection('Movies');
    
            col.deleteOne({ '_id': ObjectId(req.params.id) }, function (err, result) {
                res.status(204);
                res.json();
            });
            db.close();
        });
    });


// CREATE
app.post('/API/Movies/', function (req, res) {
    
        MongoClient.connect(mongodburl, function (err, db) {
            var col = db.collection('Movies');
            
            col.insertOne(req.body, function (err, result) {
                res.status(201);
                res.json({ msg: 'Movie Created' });
            })
            
            db.close();
        });
    });


    // UPDATE
app.put('/API/Movies/:id', function (req, res) { 
    
        MongoClient.connect(mongodburl, function (err, db) {
            var col = db.collection('Movies');
            
            col.updateOne({ '_id': ObjectId(req.params.id) }, {$set : req.body}, function(err, result){
                res.status(204);
                res.json();
            });
            db.close();
        });
    });

    module.exports = app;