

export default {
	props:['type','path'],
	data(){return{
		v:null,
		is_playing:false,
		meta_ready: false,
		peaks_rendered:false,
		src:'',
		duration:0,
		pos:0,
		skip_steps: [1,2,5,10,20],
		skip_step: 5,
		tl_width: 1800,
		tl_left: 0,
		tl_cursor_pos: 100,
		tl_scale: 5,
		peaks: null,
		peaks_canvas: null,
		peaks_ctx:null,
		peaks_canvas_height: 50,
		peaks_canvas_width:0,

		scenes: []
	}},
	mounted(){
		$(window).resize(()=>this.resize());
		this.resize();
		this.initPath();
		this.v = this.$refs.video;
		this.peaks_canvas = this.$refs.peaks_canvas_ref;

		$(window).keydown(e => {
			cl(e.code)
			switch(e.code){
				case 'ArrowLeft': this.skip(-1); break;
				case 'ArrowRight': this.skip(1); break;
				case 'Space': this.playpause(); break;
			}
		})
	},
	computed: {
		play_caption(){
			return this.is_playing ? 'Pause' : 'Play'
		},
		ready_bar_width(){
			return 700;
		},
		seen_bar_width(){
			let px = this.sec2px(this.pos);
			//cl({px})
			return px;
		},
		tl_times(){
			let tt = [];
			for(let t=10; t < this.duration-10; t+=10)
			{
				tt.push(`${Math.floor(t/60)}:${(t%60+'').padStart(2,'0')}`);
			}
			return tt;
		}
	},
	watch:{
		path(){
			this.initPath();
		}
	},
	methods: {
		resize(){
			cld({seekbar_width:this.seekbar_width()});
		},
		async initPath(){
			this.meta_ready = false;
			this.peaks_rendered = false;
			this.peaks = null;
			this.src = this.path ? '/video?url='+this.path : '';
			this.is_playing = false;
			if(this.path)
			{
				let res = await ajax('/api/get_peaks',{video_path:this.path});
				cl({peaks:res.peaks})
				this.peaks = res.peaks;
				this.renderPeaks();
			}
		},
		seekbar_left(){return $(this.$refs.seekbar).offset().left;},
		seekbar_width(){return $(this.$refs.seekbar).width();},
		tl_visible_left(){return $(this.$refs.tlwrapper).offset().left;},
		tl_visible_width(){return $(this.$refs.tlwrapper).width();},
		playpause(){
			if(this.is_playing)
				this.v.pause();
			else this.v.play();
			this.is_playing = !this.is_playing;
		},
		sec2px(sec){
			return Math.round(sec*(this.seekbar_width()/this.duration))
		},
		px2sec(px){
			return Math.round(px*(this.duration/this.seekbar_width()))
		},
		getTime(){
			return this.v.currentTime;
		},
		setTime(sec){
			cl({sec})
			this.v.currentTime = Math.round(sec);
			//
		},

		setCursorTime(sec){
			let cpos = sec*this.tl_scale;
			this.tl_cursor_pos = cpos;
			let half = this.tl_visible_width()/2;
			let lfield = cpos-half;
			let rfield = cpos+half;
			if(lfield < 0)
				this.tl_left = 0;
			else{
				if(rfield < this.tl_width)
					this.tl_left = -lfield;
				else
				{
					this.tl_left = -(this.tl_width-this.tl_visible_width())
					if(this.tl_left > 0)this.tl_left=0;
				}
			}
		},

		renderPeaks(){
			//cl('renderPeaks')
			//cl({meta_ready:this.meta_ready,peaks:!!this.peaks,peaks_rendered:this.peaks_rendered})
			if(!this.meta_ready || !this.peaks || this.peaks_rendered)
				return;
			cl('rendering peaks...')
			this.peaks_rendered = true;
			this.peaks_canvas.width = this.tl_width;

			if(!this.peaks_ctx)
				this.peaks_ctx = this.peaks_canvas.getContext('2d');

			let ctx = this.peaks_ctx;
			//cl({canvas: this.peaks_canvas, ctx})

			ctx.lineWidth = 2;

			let scaleX = this.peaks.length/this.peaks_canvas_width;
			//cl({scaleX})
			let scaleY = Math.max(...this.peaks)/this.peaks_canvas_height;
			cl({scaleY})
			let midY = Math.floor(this.peaks_canvas_height/2);
			ctx.strokeStyle = '#05d';
			ctx.beginPath();
			for(let x=0;x < this.peaks_canvas_width;x++)
			{
				let peak = this.peaks[Math.round(x*scaleX)] || 0;
				//cl({peak})
				let hpeak = Math.floor(peak/scaleY);
				//cl({hpeak})
				//cl({moveTo:[x,midY-hpeak]})
				//cl({lineTo:[x,midY+hpeak]})
				ctx.moveTo(x,midY-hpeak);
				ctx.lineTo(x,midY+hpeak+1);
			}
			ctx.closePath();
			ctx.stroke();
		},

		onMetaReady(e){
			this.meta_ready = true;
			this.duration = this.v.duration;
			this.framerate = 0;
			this.tl_width = this.duration*this.tl_scale;
			this.peaks_canvas_width = this.tl_width;
			this.renderPeaks();
		},

		progress(e){
			let v = this.v;
			//cl('progress')
			//cl(v.seekable)
		},

		timeupdate(){
			this.pos = this.v.currentTime;
			this.setCursorTime(this.pos);
			cl({pos:this.pos})
		},

		seekbar_click(e){
			let sec = this.px2sec(e.clientX-this.seekbar_left());
			//cl({seekto:sec})
			this.setTime(sec)
		},

		tl_click(e){
			let pos = e.clientX-this.tl_visible_left()-this.tl_left;
			this.setTime(pos/this.tl_scale);
		},

		skip(dir)
		{
			cl('skip');
			this.setTime(this.getTime()+(dir*this.skip_step));
		}
	},
	template: `
	<div class="custom-video"
		@keydown.right-arrow="skip(1)"
		@keydown.left-arrow="skip(-1)"
		@keydown="cl('keydown')"
	>
		<div class="video">
			<video
				ref=video
				:type="type"
				:src="src"
				@loadedmetadata="onMetaReady"
				@progress="progress"
				@timeupdate="timeupdate"
				@click="playpause"
			/>
		</div>
		<div class=panel>
			<div class=buttons>
				<button @click="playpause" v-html="play_caption"></button>
				Step: <select v-model="skip_step">
					<option
						v-for="step of skip_steps"
						:value="step"
						v-html="'± '+step+'s'"
					/>
				</select>
			</div>
			<div class=seekbar ref=seekbar @click="seekbar_click">
				<div class="bar ready" :style="{width:ready_bar_width+'px'}"></div>
				<div class="bar seen" :style="{width:seen_bar_width+'px'}"></div>
			</div>
			<div class=editor>
				<div class=timeline_wrapper ref="tlwrapper">
					<div
						class=timeline
						:style="{width:tl_width+'px',marginLeft:tl_left+'px'}"
						@click="tl_click"
					>
						<div class="times">
							<span v-for="time of tl_times"
								v-html="time"
							/>
						</div>
						<div class="labels"></div>
						<div class="sound">
							<canvas ref="peaks_canvas_ref" width="peaks_canvas_width" height="50" />
						</div>
						<div class=cursor :style="{left:tl_cursor_pos+'px'}"/>
					</div>

				</div>
			</div>
		</div>
	</div>
	`
}
