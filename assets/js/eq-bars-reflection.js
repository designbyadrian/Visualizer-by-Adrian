dbaProcessing.visualizers.rainbowEq = {
	setup: function(){
		this.context = dbaProcessing.canvas.getContext('2d');
		
		dbaProcessing.setFFTSize(512);
	},
	draw: function(){

		var bufferSize = dbaProcessing.frequencyData.length

		if(bufferSize>0) {

			var cw = dbaProcessing.canvas.width,
				ch = dbaProcessing.canvas.height,
				widthFraction = Math.ceil(cw/bufferSize);

			if(widthFraction<=1) {
				widthFraction = 2;
			}

			this.context.clearRect(0, 0, cw, ch);

			for(var i=0; i<bufferSize; i++) {
				var heightFraction = dbaProcessing.frequencyData[i] > 0 ? (dbaProcessing.frequencyData[i] / 255) * ch : 0;

				this.context.fillStyle = "hsl("+Math.round((1-(i/bufferSize))*255)+","+79+"%,"+66+"%)";
				this.context.fillRect((i*widthFraction)+widthFraction/4,ch/2-heightFraction/2,widthFraction/2,heightFraction);
			}

		} // if has data
	}
};