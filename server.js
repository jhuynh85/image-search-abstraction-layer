var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

// Serve default page
app.get('/', function(req, res){
    res.sendFile('index.html', {root: __dirname});
});

app.listen(port);