import SidePanel from './sidepanel.vue.mjs';

export default {
	components: {SidePanel},
	data(){return{
		path:'',
		dir:'',
		file:'',
		files:[],
	}},
	created(){
		if(document.location.hash)
			this.path = document.location.hash.replace(/^#/,'');
		
		//this.ping();
	},
	mounted(){
		this.$refs.video.onloadeddata  = function(){
			cl('onload')
			this.play();
		}
	},
	watch:{
		async path(s){
			let m = /^(.+?)\/([^\/]+)$/.exec(s);
			this.file = m[2];
			this.dir = m[1];
		}
	},
	computed:{
		src(){
			return this.path ? '/video?url='+this.path : '';
		}
	},
	methods:{
		async ping(){
			let res = await wssend('ping');
			///cl({res});
			if(res.cur_file!=this.file)
			{
				this.file=res.cur_file;
			}
			//cl({file:this.file})
			setTimeout(()=>this.ping(),1000);
		},
		playFile(path)
		{
			this.path = path;
			cl('play')
			this.$refs.video.play();
		},
		playNext(dir)
		{

		}
	},
	template: `<div id=player>
		<div class=video>
			<video
				ref=video
				controls
				:src="src"
			/>
		</div>
		<SidePanel
			:cur_dir="dir"
			:cur_file="file"
			@playfile="playFile"
		/>
	</div>`
}
