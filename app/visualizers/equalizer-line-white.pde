class EqLineWhite {
	void draw() {
		colorMode(RGB,255);
		background(0);

		int[] values = getMergedValues();
		int bufferSize = values.length;

		if(bufferSize>0) {
			noStroke();
			
			rectMode(CENTER);

			int widthFraction = Math.ceil(width/bufferSize);

			if(widthFraction<=1) {
				widthFraction = 2;
			}

			for(int i=0; i<bufferSize; i++) {
				int heightFraction = values[i] > 0 ? (values[i] / 255) * height * 1.5 : 0;

				fill(255,255,255);

				rect(i*widthFraction,height/2,widthFraction/2,heightFraction);
			}
		}
	}
}