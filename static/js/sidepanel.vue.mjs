import FileList from './filelist.vue.mjs';

export default {
	components: {FileList},
	props: ['cur_file','cur_dir'],
	methods:{
	},
	template: `<div class=sidepanel>
		<FileList
			:cur_file="cur_file"
			:cur_dir="cur_dir"
			@playfile="$emit('playfile',$event)"
		/>
	</div>`
}
