dbaProcessing.visualizers.grungeCircle = {
	setup: function(){
		this.context = dbaProcessing.canvas.getContext('2d');
	},
	getRotation: function(index,frequencyGroups){
		return degreesToRadians((1-(frequencyGroups[index]/255)*135)+90);
	},
	getArc: function(index,frequencyGroups){
		return degreesToRadians(270*frequencyGroups[index]/255);
	},
	draw: function(){

		if(dbaProcessing.frequencyData.length>0) {

			var numGroups = 8,
				fG = dbaProcessing.getFrequencyGroups(numGroups),
				cw = dbaProcessing.canvas.width,
				ch = dbaProcessing.canvas.height,
				x = cw / 2,
				y = ch / 2,
				w = 300,
				h = 300,
				lineWidth, lastRotation = 0;

			if(this.w > this.h) {
				this.w = this.h;
			} else {
				this.h = this.w;
			}

			lineWidth = w/2/numGroups/2;

			this.context.clearRect(0, 0, cw, ch);

			this.context.beginPath();

			this.context.translate(cw/2,ch/2);			
			x = 0; y = 0;

			for(var i=0;i<numGroups;i++) {
				this.context.rotate(-lastRotation);
				lastRotation = this.getRotation(i,fG);
				this.context.rotate(this.getRotation(i,fG));

				this.context.moveTo(x+w/2-lineWidth/2-lineWidth*(i*2+1),y);
				this.context.arc(x,y,w/2-lineWidth/2-lineWidth*(i*2+1),0,this.getArc(i,fG));
			}

			this.context.lineWidth = lineWidth;
      		this.context.strokeStyle = '#FFFFFF';
    		this.context.stroke();


    		this.context.setTransform(1, 0, 0, 1, 0, 0);
		} // if has data
	}
};