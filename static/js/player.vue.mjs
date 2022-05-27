import SidePanel from './sidepanel.vue.mjs';
import CustomVideo from './custom-video.vue.mjs';

export default {
	components: {
		SidePanel,
		CustomVideo
	},
	data(){return{
		path:'',
		file:'',
		files:[],
		volume:0
	}},
	created(){
		if(document.location.hash)
			this.path = decodeURIComponent(document.location.hash.replace(/^#/,''));
	},
	mounted(){
		// this.$refs.video.onloadeddata  = function(){
		// 	cl('onload')
		// 	this.play();
		// }

		if(!localStorage.volume)
			localStorage.volume = 40;
		this.volume = +localStorage.volume;

		// document.addEventListener('mousewheel',e=>{
		// 	e.preventDefault();
		// 	let delta = (e.deltaY > 0 ? -1 : 1);
		// 	let vol = this.volume+(delta*5);
		// 	cl({vol})
		// 	if(vol < 0)vol = 0;
		// 	if(vol > 100)vol = 100;
		// 	this.volume = vol;
		// },{passive: false})

	},
	watch:{
		async path(s){
			let m = splitDir(s)
			this.file = m[1];
		},
		volume(v)
		{
			localStorage.volume = v;
			cl({volume:v})
			//this.$refs.video.volume = v/100;
		}

	},
	computed:{
		type(){
			return 'video/'+this.path.replace(/.+?\.([^\.]+)$/,'$1');
		}
	},
	methods:{
		async ping(){
			let res = await ajax('/api/ping');
			///cl({res});
			if(res.cur_file!=this.file)
			{
				this.file=res.cur_file;
			}
			//cl({file:this.file})
			setTimeout(()=>this.ping(),1000);
		},
		onPlayFile(path)
		{
			this.path = path;
			document.location.hash = path;
			cl('play ',path)
			//this.$refs.video.play();
		}
	},
	template: `<div id=player>

		<CustomVideo
			:type="type"
			:path="path"
		/>

		<SidePanel
			:playing_path="path"
			@playfile="onPlayFile"
		/>
	</div>`
}
