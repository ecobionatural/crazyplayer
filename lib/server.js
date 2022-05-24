
import express from 'express';
import bodyParser from 'body-parser';

import fs from 'fs';
import path from 'path';

import main_router from '../routers/main.router.js';
//import wsserver from './wsserver.js'
import open from 'open';

const t = {};

global.tdata = d => {
	d.server_start = c.server_start;
	return d;
}

export default (port,onready)=>{

	var app = express();
	app.use(express.static(c.root+'/static'));
	app.use(express.json({limit:'10mb'}));
	app.set('view engine', 'pug');
	app.use(main_router);

	app.listen(port,()=>{
		cl('Serving on port '+port);
		onready();
	});

	//wsserver(port,onready);

}
