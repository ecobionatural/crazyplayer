const port = parseInt(process.argv[2]);
if(isNaN(port))
{
	console.log('Missing/incorrect port (1st argument)');
	process.exit();
}

import express from 'express';
import bodyParser from 'body-parser';

import WebSocket, { WebSocketServer } from 'ws';

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


const wss = new WebSocketServer({
	port: port+1,
	perMessageDeflate: {
	zlibDeflateOptions: {
		// See zlib defaults.
		chunkSize: 1024,
		memLevel: 7,
		level: 3
	},
	zlibInflateOptions: {
		chunkSize: 10 * 1024
	},
	// Other options settable:
	clientNoContextTakeover: true, // Defaults to negotiated value.
	serverNoContextTakeover: true, // Defaults to negotiated value.
	serverMaxWindowBits: 10, // Defaults to negotiated value.
	// Below options specified as default values.
	concurrencyLimit: 10, // Limits zlib concurrency for perf.
	threshold: 1024 // Size (in bytes) below which messages
	// should not be compressed if context takeover is disabled.
	}
});

wss.on('connection',ws=>{
	ws.on('message',d => {
		cl({message:d+''})
	})
})


})()
