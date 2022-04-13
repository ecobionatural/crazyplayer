
const port = 3333;

const instandce_id = Date.now();
localStorage.instandce_id = instandce_id;
setInterval(()=>{
	if(localStorage.instandce_id != instandce_id)
		window.close();
},100)

function loadVideo(url)
{
	$('#video').attr('src','/video?url='+url);
}

$(()=>{

if(document.location.hash)
	loadVideo(document.location.hash.replace(/^#/,''));


const ws = new WebSocket(`ws://localhost:${port+1}/`,['soap','xmpp']);

ws.onopen = ()=>{
	cl('WebSocket ok');
	ws.send(JSON.stringify({cmd:'ping',data:'qqq'}));
};
ws.onerror = e=>{
	alert('WebSocket error '+e)
}
ws.onmessage = m => {
	cl({message:m.data})
}

})
