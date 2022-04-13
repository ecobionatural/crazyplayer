const port = parseInt(process.argv[2]);
if(isNaN(port))
{
	console.log('Missing/incorrect port (1st argument)');
	process.exit();
}

const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const path = require('path');

require('./lib/lib');

c.www = __dirname+'/www';
c.server_start = Date.now();
const t = {};

global.tdata = d => {
	d.server_start = c.server_start;
	return d;
}

;(async ()=>{

var app = express();
app.use(express.static('static'));
app.use(express.json({limit:'10mb'}));
app.set('view engine', 'pug');
app.use(require('./routers/main.router.js'));

app.listen(port,()=>{cl('Serving on port '+port)});


})()
