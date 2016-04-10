class EqLineRainbow {
	void draw() {
		colorMode(HSB,1);
		background(0);

		if(bufferSize>0) {
			noStroke();
			
			rectMode(CENTER);

			int widthFraction = Math.ceil(width/bufferSize);

			if(widthFraction<=1) {
				widthFraction = 2;
			}

			for(int i=0; i<bufferSize; i++) {
				int heightFraction = frequencies[i] > 0 ? (frequencies[i] / 255) * height : 0;

				fill(1-(i/bufferSize),0.7,.8);

				rect((i*widthFraction)+widthFraction/4,height/2,widthFraction/2,heightFraction);
			}
		}
	}
}