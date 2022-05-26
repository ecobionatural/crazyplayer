import FileList from './filelist.vue.mjs';

export default {
	components: {FileList},
	props: ['cur_file','cur_dir'],
	methods:{
	},
	template: `<div class=sidepanel>
		<div class="cur_dir" v-html="cur_dir"></div>
		<FileList
			:cur_file="cur_file"
			:cur_dir="cur_dir"
			@playfile="$emit('playfile',$event)"
			@change_dir="$emit('change_dir',$event)"
		/>
	</div>`
}
