const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const explorerRoutes = require('./routes/explorer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//Fix CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//define routes that we will use. 
app.use('/explorer', explorerRoutes);

app.use((req, res, next) => {
    res.status(404);
});

//server listening on PORT 3000
app.listen(3000);
