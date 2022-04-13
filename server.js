const port = parseInt(process.argv[2]);
if(isNaN(port))
{
	console.log('Missing/incorrect port (1st argument)');
	process.exit();
}

import express from 'express';
import bodyParser from 'body-parser';

//const ws = require('ws');

import fs from 'fs';
import path from 'path';

import lib from './lib/lib.js';

import main_router from './routers/main.router.js';

c.www = c.root+'/www';
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
app.use(main_router);

app.listen(port,()=>{cl('Serving on port '+port)});


})()
