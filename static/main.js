
const port = 3333;

$(()=>{

const ws = new WebSocket(`ws://localhost:${port+1}/`,['soap','xmpp']);

ws.onopen = ()=>{
	cl('WebSocket ok');
	ws.send('Q!');
};

ws.onerror = e=>{
	alert('WebSocket error '+e)
}

ws.onmessage = m => {
	cl({message:m.data})
}

})
