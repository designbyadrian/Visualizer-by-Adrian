var processing,
	switchVisualizer = function(visualizer){
		document.body.className = visualizer;
		processing.switchVisualizer(visualizer);
	};

window.onload = function(){

	var fftSize = 512,
		count = 0,
		analyser, frequencyData
		media = navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({audio:true}) : navigator.mediaDevices.webkitGetUserMedia({audio:true}),
		renderFrame = function(){
			requestAnimationFrame(renderFrame);

			analyser.getByteFrequencyData(frequencyData);
			processing.setGraphValues(frequencyData);
		};

	media.then(function(stream){

		processing = Processing.getInstanceById('visualizer');

		var AudioContext = window.AudioContext || window.webkitAudioContect,
			audioCtx = new AudioContext(),
			audioSrc = audioCtx.createMediaStreamSource(stream);
		
		analyser = audioCtx.createAnalyser();

		analyser.fftSize = fftSize;

		frequencyData = new Uint8Array(analyser.frequencyBinCount);

		audioSrc.connect(analyser);
		
		renderFrame();
	});

	media.catch(function(err){
		console.warn(err.name,err);
	});
};