const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(express.static('wwwroot'));
const path = __dirname + '/public/'; // path til mappen, + public da html filer ligger i public mappen

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

var Cors = require('cors');
app.use(Cors());

const movieModule = require('./API.js');
app.use(movieModule);

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const mongodburl = 'mongodb://mooz321:zbalezbale@cluster0-shard-00-00-fpxig.mongodb.net:27017,cluster0-shard-00-01-fpxig.mongodb.net:27017,cluster0-shard-00-02-fpxig.mongodb.net:27017/ligeGyldig?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';





app.get('/', function(req, res){
    res.render('index.ejs');
});



app.post('/home', function(req, res){
    if(!(req.body.email == "Mooz" && req.body.password == "123")){
        res.redirect('/');
    } else{
        
    MongoClient.connect(mongodburl, function (err, db) {
        
                var col = db.collection('Movies');
                // Read All
                col.find().toArray(function (err, result) {
                    //console.log(result);
                    res.render('home.ejs', {Movies: result});
                });
                db.close();
            });
        }
        });

        app.get('/home', function(req, res){
            MongoClient.connect(mongodburl, function (err, db) {
                
                        var col = db.collection('Movies');
                        // Read All
                        col.find().toArray(function (err, result) {
                            //console.log(result);
                            
                            res.render('home.ejs', {Movies: result});
                            console.log("test1");
                        }); 
                        console.log("test2");
                        db.close();
                    });
                });
        

        app.post('/bestil', function(req, res){
            MongoClient.connect(mongodburl, function (err, db) {
                
                    var col = db.collection('Movies');
                        // Read All
                        col.find({"Name": req.body.Name}).toArray(function (err, result) {
                            //console.log(result);
                            res.render('movie.ejs', {Movies: result});
                        });
                        db.close();
                    });
                });
                
        // bestillinger gemmes i besttling database
         app.post('/bestillinger', function(req, res){
            MongoClient.connect(mongodburl, function (err, db) {
                db.collection('orders').save(req.body)
                console.log(req.body)
                console.log('saved to database')
                 res.redirect('/home')
                });
        });

        app.get('/bestillinger', function(req, res) {
            MongoClient.connect(mongodburl, function (err, db) {
                
                        var col = db.collection('orders');
                        // Read All
                        col.find().toArray(function (err, result) {
                            //console.log(result);
                            res.render('bestillinger.ejs', {orders: result});
                        });
                        db.close();
                    });          
        });
               

                 


app.get('/opret', function(req, res){
    
    res.render('opret.ejs');
    
});

//opret movie
app.post('/opret', function(req, res){
    MongoClient.connect(mongodburl, function (err, db) {
        db.collection('Movies').save(req.body)
        console.log('saved to database')
         res.redirect('/opret')
        });
});


app.get('/remove', function(req, res){
res.render('remove.ejs');
});


//remove Database  
app.post('/remove', function(req, res){ 
    MongoClient.connect(mongodburl, function (err, db) {
        db.collection('Movies').findOneAndDelete({Name: req.body.Name}); 
        console.log('saved to database')
         res.redirect('/remove')
        });
});




app.listen(process.env.PORT || 3000);