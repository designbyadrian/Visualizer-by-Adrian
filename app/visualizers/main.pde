Object current = new EqLineRainbow;
int bufferSize;
int[] leftValues;
int[] rightValues;

void setup() {
	size(window.innerWidth,window.innerHeight);
	frameRate(30);
}

void draw() {
	current.draw();
}

void setBufferSize(int bs) {
	bufferSize = bs/2;
}

void setGraphValues(Array arr) {

	int[] newLeftValues = new int[bufferSize/2];
	int[] newRightValues = new int[bufferSize/2];

	for(int i=0;i<bufferSize/2;i++) {
		newLeftValues[i] = arr[i];
	}

	for(int j=0;j<bufferSize/2;j++) {
		newRightValues[j] = arr[j+bufferSize/2];
	}

	leftValues = newLeftValues;
	rightValues = newRightValues;
}

void getMergedValues() {
	int[] newValues = new int[bufferSize/2];

	for(int i=0,j=bufferSize/2;i<j;i++) {
		newValues[i] = (leftValues[i] + rightValues[i]) / 2;
	}

	return newValues;
}

void switchVisualizer(String visualizer) {
	noLoop();
	current = eval("new "+visualizer);
	loop();
}