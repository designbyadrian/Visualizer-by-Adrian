var dbaProcessing = {
		fps: 60,
		bpm: 143,
		bpmMin: 60,
		bpmMax: 240,
		fftSize: 512,
		frequencyData: [],
		visualizers: {},
		timerThen: Date.now(),
		beatCutOff: 0,
		beatDecayRate: 0.98,
		beatMin: 0.27,
		beatTime: 0,
		bpmTime: 0,
		wasBeat: false,
		setVisualizer: function(v){
			console.log("set \""+v+"\"",this.visualizers);
			if(this.visualizers.hasOwnProperty(v)&&this.current!=v) {
				document.body.className = v.toDash();
				this.current = v;
				this.visualizers[v].setup();
			}
		},
		loop: function(){
			var _this = this;
			
			if(this.run) {
				requestAnimationFrame(function(){
					_this.loop();
				});
			}

			var now = Date.now(),
				elapsed = now - this.timerThen;

			if(elapsed > 1000/this.fps) {
				this.timerThen = now - (elapsed % (1000/this.fps));

				this.analyser.getByteFrequencyData(this.frequencyData);

				this.normalizeLevels(this.analyser.frequencyBinCount);

				this.visualizers[this.current].draw();
			}

		},
		normalizeLevels: function(binCount){

			/* Stolen from https://www.airtightinteractive.com/2013/10/making-audio-reactive-visuals/*/

			var levelsCount = 16,
				levelBins = Math.floor(binCount / levelsCount),
				levelsData = [];

			for(var i=0; i<levelsCount; i++) {
				var sum = 0;
				for(var j=0; j<levelBins;j++) {
					sum += this.frequencyData[(i*levelBins)+j];
				}
				levelsData[i] = sum / levelBins / (binCount / 2) * 0.5;
			}

			var sum = 0;

			for(var j=0;j<levelsCount;j++) {
				sum+=levelsData[j];
			}
			this.level = sum / levelsCount;

			this.detectBeat();
		},
		detectBeat: function(){
			if(this.level > this.beatCutOff && this.level > this.beatMin) {
				this.beat();
				this.beatCutOff = this.level * 1.1;
				this.beatTime = 0;
			} else {
				if(this.beatTime <= this.beatHoldTIme) {
					this.beatTime++;
				} else {
					this.beatCutOff *= this.beatDecayRate;
					this.beatCutOff = Math.max(this.beatCutOff,this.beatMin);
				}
			}
		},
		beat: function(){
			
			var _this = this,
				now = Date.now();

			if(now>this.bpmTime+(60000/this.bpmMax)) {

				var bpm = 60000/(now-this.bpmTime);

				if(bpm>0) {
					this.bpm = Math.max(Math.round(bpm),this.bpmMin);
					this.wasBeat = true;
				}

				this.bpmTime = now;
			} else if(now>this.bpmTime) {
				this.wasBeat = false;
			}
		},
		start: function(v){
			this.setVisualizer(v);

			if(!this.run) {
				this.run = true;
				
				this.loop();
			}
		},
		stop: function(){
			this.run = false;
		},
		getFrequencyGroups: function(num){
			var groupedValues = [],
				numValues = this.frequencyData.length/num;

			for(var i=0;i<num;i++) {
				groupedValues.push(this.frequencyData.slice(i*numValues,i*numValues+numValues));
			}

			return groupedValues.map(function(group){
				return Math.round(group.reduce(function(prev,curr){
					return prev+curr;
				})/group.length);
			});
		},
		easing: {
			linear: function(p){
				return p;
			},
			easeInQuad: function(p){
				return Math.pow(p,2);
			},
			easeOutQuad: function(p){
				return 1-dbaProcessing.easing.easeInQuad(1-p);
			},
		},
		setup: function(){
			var _this = this,
				media = navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({audio:true}) : navigator.mediaDevices.webkitGetUserMedia({audio:true});

			_this.canvas = document.getElementById('visualizer');
			_this.canvas.width = window.innerWidth;
			_this.canvas.height = window.innerHeight;

			media.then(function(stream){

				var AudioContext = window.AudioContext || window.webkitAudioContect,
					audioCtx = new AudioContext(),
					audioSrc = audioCtx.createMediaStreamSource(stream);
				
				_this.analyser = audioCtx.createAnalyser();

				_this.analyser.fftSize = _this.fftSize;

				_this.frequencyData = new Uint8Array(_this.analyser.frequencyBinCount);

				audioSrc.connect(_this.analyser);
			});

			media.catch(function(err){
				console.warn(err.name,err);
			});
		},
		setFFTSize: function(fftSize){
			this.analyser.fftSize = fftSize>=32?fftSize:32;
			this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
		}
	};

window.onload = function(){
	dbaProcessing.setup();

	var btn = document.getElementById("options");

	btn.addEventListener("click",function(e){

		e = e || window.event;
		var target = e.target || e.srcElement;

		dbaProcessing.start(target.getAttribute("data-visualizer"));
	},false);
};

var degreesToRadians = function(deg) {
	return deg * (Math.PI/180);     
}

String.prototype.toDash = function(){
	return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
};