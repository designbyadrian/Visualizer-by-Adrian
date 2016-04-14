var Penguin = function(x,y,maxY,w) {
	this.baseX = x;
	this.baseY = y;
	this.maxY = maxY;
	this.x = this.baseX;
	this.y = this.baseY;
	this.destY = 0;
	this.width = w;
	this.hopping = false;
	this.falling = false;
};

Penguin.prototype = {
	draw: function(gfx,ctx){
		this.height = gfx.stand.img.height * ((this.width/gfx.stand.img.width));
		ctx.drawImage(gfx.stand.img,this.baseX,this.baseY,this.width,this.height);
	},
	delta: function(easing){
		var timePassed = Date.now() - this.start;
		this.progress = timePassed / (this.duration / 2);

		if(this.progress > 1) {
			this.progress = 1;
		}

		return dbaProcessing.easing[easing](this.progress);
	},
	hop: function(value,gfx,ctx){
		if(!this.hopping && value>12) {

			this.hopping = true;
			this.duration = 60000/dbaProcessing.bpm; // we don't want to change speed mid-hop
			this.progress = 0;
			this.start = Date.now();

			this.destY = (1-(value/255)) * (this.baseY - this.maxY) + this.height;

		}
		if(this.hopping) {

			/* change to only clear the vertical rectangle on which a penguin sits,
				so a penguin that should jump to 0 will not clear the canvas, as it's wasteful
				and will flicker on low FPSs. Also the penguin disappears when the value is 0 */
			ctx.clearRect(this.baseX, 0, this.width, dbaProcessing.canvas.height);

			var img = gfx.hop.img;

			if(!this.falling) {

				this.y = ( (1-this.delta('easeOutQuad')) * (this.baseY - this.destY) ) + this.destY;

				if(this.progress>=1) {
					this.y = this.destY;
					this.falling = true;
					this.progresss = 0;
					this.start = Date.now();
				}
			}
			if(this.falling) {

				img = gfx.land.img;

				this.y = (this.delta('easeInQuad') * (this.baseY - this.destY) ) + this.destY;

				if(this.progress>=1) {
					this.y = this.baseY;
					this.falling = false;
					this.hopping = false;
					img = gfx.stand.img;
				}

			}

			ctx.drawImage(img,this.x,this.y,this.width,img.height * ((this.width/img.width)));
		}
	}
};

dbaProcessing.visualizers.losPenguinos = {
	numPenguins: 8,
	penguins: [],
	setup: function(){
		
		var _this = this;

		this.context = dbaProcessing.canvas.getContext('2d');

		this.gfx = {
			stand: {loaded:false,img:new Image()},
			hop: {loaded:false,img:new Image()},
			land: {loaded:false,img:new Image()},
		};

		dbaProcessing.setFFTSize(32);

		this.penguins = [];

		var padding = 10,
			cw = dbaProcessing.canvas.width,
			ch = dbaProcessing.canvas.height,
			penguinW = Math.max(cw/(_this.numPenguins+4),100),
			penguinTrainWidth = penguinW*_this.numPenguins + padding*(_this.numPenguins-1),
			margin = (cw-penguinTrainWidth) / 2,
			drawPenguins = function(){

				if(_this.gfx.stand.loaded==true&&_this.gfx.hop.loaded==true&&_this.gfx.land.loaded==true) {

					/* 8 little penguins on the wall */
					for(var i=0;i<_this.numPenguins;i++) {

						var pX = Math.round(margin+(i*penguinW)+(i*padding)),
							pY = Math.round(ch*0.6),
							maxY = Math.round(ch*0.2),
							penguin = new Penguin( pX,pY,maxY,penguinW );

						penguin.draw(_this.gfx,_this.context);

						_this.penguins.push(penguin);
					}

				}
			};

		this.context.clearRect(0, 0, cw, ch);

		this.gfx.stand.img.onload = function(){_this.gfx.stand.loaded=true;drawPenguins()};
		this.gfx.hop.img.onload = function(){_this.gfx.hop.loaded=true;drawPenguins()};
		this.gfx.land.img.onload = function(){_this.gfx.land.loaded=true;drawPenguins()};
		
		this.gfx.stand.img.src = "img/el_penguino-stand.svg";
		this.gfx.hop.img.src = "img/el_penguino-hop.svg";
		this.gfx.land.img.src = "img/el_penguino-land.svg";
	},
	draw: function(){
		if(dbaProcessing.frequencyData.length>0&&this.penguins.length==this.numPenguins) {

			var fG = dbaProcessing.getFrequencyGroups(this.numPenguins),
				cw = dbaProcessing.canvas.width,
				ch = dbaProcessing.canvas.height;

			for(var i=0;i<this.numPenguins;i++) {
				this.penguins[i].hop(fG[i],this.gfx,this.context);
			}
	
		} // if has data
	}
};