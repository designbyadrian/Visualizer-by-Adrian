class EqLineRainbow {
	void draw() {
		colorMode(HSB,1);
		background(0);

		if(values.length>0) {
			noStroke();
			
			rectMode(CENTER);

			int widthFraction = Math.round(width/bufferSize);
			
			if(widthFraction<=1) {
				widthFraction = 2;
			}

			for(int i=0; i<bufferSize; i++) {
				int heightFraction = values[i] > 0 ? (values[i] / 255) * height * 1.5 : 0;

				fill(1-i/bufferSize,0.7,.8);

				rect(i*widthFraction,height/2,widthFraction/2,heightFraction);
			}
		}
	}
}