Object current = new EqLineRainbow;
int bufferSize;
Array values = new Array();

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

	int[] newValues = new int[bufferSize];

	for(int i=0;i<bufferSize;i++) {
		newValues[i] = (arr[i] + arr[i+bufferSize]) / 2;
	}

	values = newValues;
}

void switchVisualizer(String visualizer) {
	noLoop();
	current = eval("new "+visualizer);
	loop();
}