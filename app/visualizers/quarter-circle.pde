class QuarterEQCircle {
	
	int ex,ey,ew,eh,g;

	QuarterEQCircle() {
		colorMode(RGB,255);
	}

	void draw() {

		if(bufferSize>0) {

			background(222,201,180);

			int[] frequencyGroups = getGroupedGraphValues(4);

			this.ex = width/2;
			this.ey = height/2;
			this.ew = Math.min(width*0.75,300);
			this.eh = Math.min(height*0.75,300);

			if(this.ew > this.eh) {
				this.ew = this.eh;
			} else {
				this.eh = this.ew;
			}

			int sWeight = ew / 20;

			strokeWeight(sWeight);

			fill(0);
			noStroke();

			ellipse(this.ex,this.ey,this.ew,this.eh);

			stroke(255);

			ellipse(this.ex,this.ey,this.ew-sWeight*4,this.eh-sWeight*4);

			ellipse(this.ex,this.ey,this.ew-sWeight*8,this.eh-sWeight*8);

			ellipse(this.ex,this.ey,this.ew-sWeight*12,this.eh-sWeight*12);

			ellipse(this.ex,this.ey,this.ew-sWeight*16,this.eh-sWeight*16);

			strokeWeight(sWeight*1.1);

			noFill();
			stroke(0);

			arc(this.ex,this.ey,this.ew-sWeight*4,this.eh-sWeight*4,radians( (-1*(1-(frequencyGroups[0]/255))*360)-45 ),radians(-45));

			arc(this.ex,this.ey,this.ew-sWeight*8,this.eh-sWeight*8,radians( (-1*(1-(frequencyGroups[1]/255))*360)-45 ),radians(-45));

			arc(this.ex,this.ey,this.ew-sWeight*12,this.eh-sWeight*12,radians( (-1*(1-(frequencyGroups[2]/255))*360)-45 ),radians(-45));

			arc(this.ex,this.ey,this.ew-sWeight*16,this.eh-sWeight*16,radians( (-1*(1-(frequencyGroups[3]/255))*360)-45 ),radians(-45));
		}
	}
}