const cl = console.log;
const cld = s => cl(JSON.stringify(s));

function parse_json(s, def = {}) {
	if (!s) return def;
	try {
		return JSON.parse(s);
	} catch (e) {
		return def;
	}
}

async function ajax(url, data) {
	let j = {};

	let res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	j = await res.json();
	if (j.error)
		throw (j.error);

	return j;
}

let ws;
function initWebSocket(port)
{
	return new Promise((s,j)=>{
		ws = new WebSocket(`ws://localhost:${port}/`,['soap','xmpp']);
		ws.onopen = ()=>{
			cl('WebSocket ok');
			s();
		};
		ws.onerror = e=>{
			alert('WebSocket error '+e)
			j();
		};
		ws.onclose = e => {
			alert('Server lost. Restart application.');
		}
	})
}

async function wssend(cmd,data=null)
{
	return new Promise((s,j)=>{
		ws.onmessage = m => {s(JSON.parse(m.data))};
		ws.onerror = e => {
			ws.onerror = e => {
				alert('Server lost. Restart application.');
			}
			j(e);
		}
		ws.send(JSON.stringify({cmd,data}));
	})

}

function copy(src, dst, fields) {
	for (let f of fields)
		dst[f] = src[f];
	return dst;
}

function redir(url) {
	document.location.href = url;
}

async function delay(ms) {
	return new Promise(s => setTimeout(s, ms));
}

function debounce(func, timeout = 300) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

function ec(name,value)
{
	document.execCommand(name,false,value);
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
