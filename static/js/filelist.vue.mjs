
export default {
	props: ['cur_dir','cur_file'],
	data(){return{
		dir:'',
		files:''
	}},
	created(){
		this.dir = this.cur_dir;
		window.onkeydown = e => {
			if(e.key=='PageDown' || e.key=='PageUp')
			{
				e.preventDefault();
				this.playNext(e.key=='PageDown' ? 1 : -1);
			}
		}
	},
	watch:{
		async dir(){
			let res = await wssend('get_folder_files',{dir:this.dir});
			this.files = res.files;
		}
	},
	methods:{
		playNext(direction)
		{
			cl({direction})
			if(this.dir!=this.cur_dir)
			{
				this.dir = this.cur_dir;
				setTimeout(()=>{this.playNext(direction)},0);
				return;
			}

			let ind = this.files.findIndex(v => v==this.cur_file);
			if((direction > 0 && ind < this.files.length-1) || (direction < 0 && ind>0))
			{
				ind += direction;
				this.$emit('playfile',this.dir+'/'+this.files[ind]);
			}
		}
	},
	template: `
	<div class="filelist">
		<div
			class=item
			v-for="file of files"
			:key="file"
			v-html="file"
			:class="{current:file==cur_file && dir==cur_dir}"
			@click="$emit('playfile',dir+'/'+file)"
		/>
	</div>`
}
