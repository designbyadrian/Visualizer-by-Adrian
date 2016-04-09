int bufferSize;
Array values = new Array();

void setup() {
	size(window.innerWidth,window.innerHeight);
	frameRate(30);

	colorMode(HSB,1);
}

void draw() {



	background(0);

	if(values.length>0) {
		noStroke();
		
		rectMode(CENTER);

		int widthFraction = Math.round(width/bufferSize);
		
		if(widthFraction<=1) {
			widthFraction = 2;
		}

		for(int i=0; i<bufferSize; i++) {
			int heightFraction = values[i] > 0 ? (values[i] / 255) * height : 0;

			fill(1-i/bufferSize,0.7,0.66);


			rect(i*widthFraction,height/2,widthFraction/2,heightFraction);
		}
	}
}

void setBufferSize(int bs) {
	bufferSize = bs/2;
}

void setGraphValues(Array arr) {

	int[] newValues = new int[bufferSize];

	for(int i=0;i<bufferSize;i++) {
		newValues[i] = (arr[i] + arr[i+bufferSize]) / 2;
	}

	values = newValues;
}