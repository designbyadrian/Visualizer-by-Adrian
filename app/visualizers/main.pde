Object current = new EqLineRainbow;

int[] bufferSize;
int[] frequencies;

void setup() {
	size(window.innerWidth,window.innerHeight);
	frameRate(15);
}

void draw() {
	current.draw();
}

void setGraphValues(Array arr) {
	frequencies = arr;
	bufferSize = frequencies.length;
}

void switchVisualizer(String visualizer) {
	noLoop();
	current = eval("new "+visualizer);
	loop();
}