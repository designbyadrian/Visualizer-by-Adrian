var dbaProcessing = {
		fps: 30,
		fftSize: 512,
		frequencyData: [],
		visualizers: {},
		setVisualizer: function(v){
			console.log("set ",v);
			if(this.visualizers.hasOwnProperty(v)) {
				document.body.className = v.toDash();
				this.current = v;
				this.visualizers[v].setup();
			}
		},
		loop: function(){
			var _this = this;
			
			this.analyser.getByteFrequencyData(this.frequencyData);

			this.visualizers[this.current].draw();

			if(this.run) {
				requestAnimationFrame(function(){
					_this.loop();
				});
			}
		},
		start: function(v){
			this.setVisualizer(v);

			if(!this.run) {
				this.run = true;
				
				// if(!this.current) {
				// 	this.setVisualizer(Object.keys(this.visualizers)[0]);
				// }
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