Object current = new QuarterEQCircle();

int[] bufferSize;
int[] frequencies;

void setup() {
	size(window.innerWidth,window.innerHeight);
	frameRate(30);
}

void draw() {
	current.draw();
}

void setGraphValues(Array arr) {
	frequencies = arr;
	bufferSize = frequencies.length;
}

void getGroupedGraphValues(int numGroups) {
	int[] values = new int[numGroups];
	groupedValues = new ArrayList();

	for(int i=0;i<numGroups;i++) {
		int[] frequencyGroup = new int[frequencies.length/numGroups];

		arrayCopy(frequencies,i*(frequencies.length/numGroups),frequencyGroup,0,frequencies.length/numGroups);
		groupedValues.add(frequencyGroup);
	}

	for(int j=0;j<groupedValues.size();j++) {
		int total = 0;
		int[] frequencyGroup = groupedValues.get(j);
		for(int jj=0;jj<frequencyGroup.length;jj++) {
			total = total + frequencyGroup[jj];
		}
		values[j] = Math.round(total/frequencyGroup.length);
	}

	return values;
}

void switchVisualizer(String visualizer) {
	noLoop();
	current = eval("new "+visualizer);
	loop();
}