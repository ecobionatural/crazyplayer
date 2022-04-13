const fs = require('fs');
const path = require('path')

global.c = {};
c.env = fs.existsSync('/.dev') ? 'dev' : 'prod';
c.dev = c.env=='dev';
c.root = path.resolve(__dirname,'..');
c.www = __dirname+'/www';

function wr(s){process.stdout.write(s);}
const cl = console.log

//cl(c)

const dbg = c.dev ? (...a)=>console.log(...a) : ()=>{}

let oninput,input_listener;
async function input(msg='')
{
	if(!oninput)
	{
		oninput = d => input_listener((d+'').trim());
		process.stdin.on('data',oninput);
	}
	wr(msg);
	return new Promise(s => {
		input_listener = str => s(str)
	})
}

async function yesno(msg,throwMsg='Wrong answer )))')
{
	let s = await input(msg+' (y/n): ');
	res = s.trim().toLowerCase()=='y';

	if(!res && throwMsg)
		throw throwMsg;
	return res;
}

function exec(cmd)
{
	const {spawn} = require('child_process');
	let child = spawn(cmd,{shell:true});
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
}

function deepclone(obj)
{
	return JSON.parse(JSON.stringify(obj));
}

function copy(src,dst,fields)
{
	for(let f of fields)
		dst[f] = src[f];
	return dst;
}

function initPath(s)
{
	if(!fs.existsSync(s))
	{
		let parent = path.dirname(s);
		if(!fs.existsSync(parent))
			initPath(parent);
		fs.mkdirSync(s);
	}
	return s.replace(/\\/g,'/');
}

function delay(ms)
{
	return new Promise(s => setTimeout(s,ms));
}

function nowSec()
{
	return Math.floor(Date.now()/1000);
}

function datetime()
{
	return new Date().toISOString().replace(/([TZ]|\..+)/g,' ').trim();
}



global.wr = wr;
global.cl = cl;
global.dbg = dbg;
global.appRoot = __dirname;


const lib = {
	c,
	input,
	yesno,
	wr,
	cl,
	dbg,
	exec,
	initPath,
	delay,
	nowSec,
	datetime,
	deepclone,
	copy
};

global.lib = lib;
