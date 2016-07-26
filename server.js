var express = require('express');
var app = express();
var moment = require('moment');
var Bing = require('node-bing-api')({ accKey: process.env.BING_KEY });
var mongo = require('mongodb').MongoClient;

var port = process.env.PORT || 8080;
var mongoURL = process.env.MONGOLAB_URI || 'mongodb://localhost:27017';

// Reroute favicon request to default page
app.get('/favicon.ico', function(req,res){
    res.redirect('/');
});

// Display latest queries
app.get('/latest', function(req,res){
    mongo.connect(mongoURL, function(err, db){
        if (err) throw err;
        var queryCollection = db.collection('queries');
        queryCollection.find({}).toArray(function(err, doc){
            if (err) throw err;
            if (doc[0] != null) {
                //console.log(doc[0]);
                res.send(doc[0].queries);
            } else {
                console.log('Error, no query list');
                res.send([{'error': 'No previous queries to list'}]);
            }
            db.close();
        });
    });
});

// Process search query
app.get('/:searchStr', function(req, res){
    console.log('SearchStr:'+req.params.searchStr);
    console.log('Query:'+req.query.offset);
    var results;
    
    var searchString = req.params.searchStr;
    var offset = (req.query.offset == null)?0:req.query.offset;
    
    // Store search query
    mongo.connect(mongoURL, function(err, db){
        if (err) throw err;
        var queryCollection = db.collection('queries');
        var queryList=[];
        
        // New query
        var query = {
            'term': searchString,
            'when': moment().format()
        };
        
        // Find queryList if one exists and add new query
        queryCollection.find({}).toArray(function(err, doc){
            if (err) throw err;
            if (doc[0] != null) {
                //console.log(doc[0]);
                console.log('Adding to queryList');
                queryList = doc[0].queries;
                if (queryList.length == 10) queryList.pop(); // Remove oldest query once list has 10 queries
                queryList.unshift(query);
            } else {
                // Insert new doc
                console.log('Creating new queryList');
                queryList.unshift(query);
            }
            //console.log(queryList);
                
            // Upsert updated queryList
            queryCollection.findOneAndUpdate(
                { },
                { $set: {queries: queryList}},
                { 
                    upsert: true,
                    returnOriginal: false    
                },
                function(err, doc){
                    if (err) throw err;
                    if (doc != null) {
                       console.log(queryList);
                    } else {
                        console.log('Error inserting document');
                        res.redirect('/');
                    }
                    db.close();
            });
        });
    });
    
    
    Bing.composite(searchString, {
            top: 10,  // Number of results (max 15 for news, max 50 if other) 
            skip: offset,  // Skip first < results 
            sources: "image", //Choices are web+image+video+news+spell 
            newsSortBy: "Relevance" //Choices are Date, Relevance 
        }, 
        function(error, resp, body){
            if (error) throw error;
            //console.log(body.d.results[0].Image);
            results = body.d.results[0].Image;
            var json = [];
            
            // Populate json with search results
            for (var i=0; i<10; i++){
                json.push({
                    'url': results[i].MediaUrl,
                    'snippet': results[i].Title,
                    'thumbnail': results[i].Thumbnail.MediaUrl,
                    'context': results[i].SourceUrl
                });
            }
            res.send(json);
        });
});


// Serve default page
app.get('/', function(req, res){
    res.sendFile('index.html', {root: __dirname});
});


app.listen(port);