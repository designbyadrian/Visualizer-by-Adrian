int bufferSize;
Array values = new Array();

void setup() {
	size(window.innerWidth,window.innerHeight);
	frameRate(30);
}

void draw() {
	background(255);

	if(values.length>0) {
		noStroke();
		fill(50,50,50);
		rectMode(CENTER);

		int widthFraction = Math.round(width/bufferSize);
		
		if(widthFraction<=1) {
			widthFraction = 2;
		}

		for(int i=0; i<bufferSize; i++) {
			int heightFraction = values[i] > 0 ? (values[i] / 255) * height : 0;

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