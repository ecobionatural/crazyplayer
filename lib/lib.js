import lib from './common_lib.js';
//const mongo = require('../lib/mongo');

import config from '../config.js';

Object.assign(c,config);

async function initMongo()
{
	const MongoClient = require("mongodb").MongoClient;
	if(global.db)return;
	let client = new MongoClient("mongodb://localhost:27017/", {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	let conn = await client.connect();
	global.db = conn.db(c.appname);
}

async function initCollection(name,index)
{
	await initMongo()
	const coll = db.collection(name);

	if(index)
		await coll.createIndex({[index]:1},{unique: true});
	return coll;
}

const ru_alph = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
const ru_vowels = 'аеёиоуыэюя';
const ru2en = 'a,b,v,g,d,e,e,zh,z,i,y,k,l,m,n,o,p,r,s,t,u,f,h,ts,ch,sh,sch,,i,,e,u,ya'.split(',');
function translit(s)
{
	return s
		//.replace(/ый/g,'iy')
		.replace(/(?<=^|[аеёиоуыэюя])ю/g,'yu')
		.replace(/(?<=^|[аеёиоуыэюя])ё/g,'yo')
		.replace(/[а-яё]/g,m => ru2en[ru_alph.indexOf(m)])
		.replace(/[А-ЯЁ]/g,m => ucfirst(ru2en[ru_alph.indexOf(m.toLowerCase())]))
}

function urlify(s)
{
	return translit(s.toLowerCase())
		.replace(/[^a-z\d]+/ig,'_')
		.replace(/_+$/,'');
}

async function api(req,res,actions)
{
	let b = req.body;
	let cmd = req.params.cmd;
	let out = {};
	try{
		let action = actions[cmd];
		if(!action)
			throw 'Unknown command';
		out = await action(b,req,res);
	}
	catch(e)
	{
		cl(e);
		out.error = e+'';
	}
	res.json(out);
}


Object.assign(lib,{
	initMongo,
	initCollection,
	translit,
	urlify,
	api
})

export default lib;
