var canvas, ctx, xStart, yStart, mSize;
var h, w;
var xScale=[], yScale=[];
var maxIter = 100;
var limit = 200;
var mzoom, mstep, miterac, mred, mgreen, mblue, tzoom, input;
var red, green, blue;
var max = maxIp = maxRp = maxIn = maxRn = 0;
var mouseClicked = false, mouseReleased = true;
var zoom = 4;
var outWindow = [-2,-1.25,1,1.25];
var start = [-0.15, -.7];
var size = 0.2;
var clickx = clicky = 0;
var step = 100;
var tempMaxIter=0;


onload = function(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    miteract = document.getElementById("iteract");
    mzoom = document.getElementById("zoom");
    xStart = document.getElementById("xStart");
    yStart = document.getElementById("yStart");
    mSize = document.getElementById("size");
    mstep = document.getElementById("step");
    mred = document.getElementById("red");
    mgreen = document.getElementById("green");
    mblue = document.getElementById("blue");
    tzoom = document.getElementById("tZoom");
    input = document.getElementById("input");
    freeSpace = window.innerHeight - input.offsetHeight;
    canvas.height = freeSpace;
    canvas.width = freeSpace * (3/2.5);
    h = canvas.height - 1;
    w = canvas.width - 1;

    ctx.fillStyle="black";
    ctx.fillRect(0,0,w,h);
    canvas.addEventListener("click", onMouseClick, false);

    fractal();
}

function fractal(){
    loadForm();
    for (var x=0; x<w; x++){
      for (var y=0; y<h; y++){
        var px = (x/xScale[0]) + xScale[1];
        var py = (y/yScale[0]) + yScale[1];
        c = isIn(px,py);
        ctx.fillStyle = rgb(c[0],c[1],c[2]);
        ctx.fillRect(x,y,1,1);
      }
    }
    tzoom.innerText = "Total Zoom: "+Math.round(100*3/size)/100;
}

function isIn(x, y){
  var imNum = Complex(0,0);
  var r=g=b=0;
  var c = Complex(x,y);
  var result=0;
  var inter;
  for (inter=0; inter<maxIter; inter++){
    imNum = imNum.multiply(imNum);
    imNum = imNum.add(c);
    result = imNum.abs();

    if (result>limit) {
      result = limit;
      break;}
  }

  if (Math.abs(imNum.real) > Math.sqrt(limit)){
      r = (inter/21)*red;
  }
  if (Math.abs(imNum.imag) > Math.sqrt(limit)){
      g = (inter/21)*green;
  }

  if (inter>21){
    inter = 0;
  }

  b = (inter/21)*blue;

  return ([r,g,b]);
}

function loadForm(){
  freeSpace = window.innerHeight - input.offsetHeight;
  canvas.height = freeSpace;
  canvas.width = freeSpace * (3/2.5);
  h = canvas.height - 1;
  w = canvas.width - 1;
  start = [parseFloat(xStart.value), parseFloat(yStart.value)];
  size = parseFloat(mSize.value);
  outWindow = [start[0],start[1],start[0]+size,start[1]+(size*h/w)];
  this.xScale = [w/(outWindow[2]-outWindow[0]), outWindow[0]];
  this.yScale = [h/(outWindow[3]-outWindow[1]), outWindow[1]];
  zoom = parseFloat(mzoom.value);
  step = parseInt(mstep.value);
  maxIter = parseInt(miteract.value);
  red = parseInt(mred.value);
  green = parseInt(mgreen.value);
  blue = parseInt(mblue.value);
}


function left(){
  loadForm();
  xStart.value = start[0]+size/(w/step);
  fractal();
}

function right(){
  loadForm();
  xStart.value = start[0]-size/(w/step);
  fractal();
}

function up(){
  loadForm();
  yStart.value = start[1]+size/(w/step);
  fractal();
}

function down(){
  loadForm();
  yStart.value = start[1]-size/(w/step);
  fractal();
}


function onMouseClick(e) {
    loadForm();
    clickx = e.layerX;
    clicky = e.layerY;
    var xPlace = (outWindow[2]-outWindow[0])*(clickx/w) + outWindow[0];
    var yPlace = (outWindow[3]-outWindow[1])*(clicky/h) + outWindow[1];

    size = size / zoom;
    mSize.value = size;

    xStart.value = xPlace - size/2;
    yStart.value = yPlace - size/2;

    fractal();
}



function rgb(r, g, b){
  r = Math.min(Math.floor(r),255);
  g = Math.min(Math.floor(g),255);
  b = Math.min(Math.floor(b),255);
  return ["rgb(",r,",",g,",",b,")"].join("");
}


// from: https://gist.github.com/dsamarin/1258353
var Complex = function(real, imag) {
	if (!(this instanceof Complex)) {
		return new Complex (real, imag);
	}

	if (typeof real === "string" && imag == null) {
		return Complex.parse (real);
	}

	this.real = Number(real) || 0;
	this.imag = Number(imag) || 0;
};

Complex.parse = function(string) {
	var real, imag, regex, match, a, b, c;

	// TODO: Make this work better-er
	regex = /^([-+]?(?:\d+|\d*\.\d+))?[-+]?(\d+|\d*\.\d+)?[ij]$/i;
	string = String(string).replace (/\s+/g, '');

	match = string.match (regex);
	if (!match) {
		throw new Error("Invalid input to Complex.parse, expecting a + bi format");
	}

	a = match[1];
	b = match[2];
	c = match[3];

	real = a != null ? parseFloat (a) : 0;
	imag = parseFloat ((b || "+") + (c || "1"));

	return new Complex(real, imag);
};

Complex.prototype.copy = function() {
	return new Complex (this.real, this.imag);
};

Complex.prototype.add = function(operand) {
	var real, imag;

	if (operand instanceof Complex) {
		real = operand.real;
		imag = operand.imag;
	} else {
		real = Number(operand);
		imag = 0;
	}
	this.real += real;
	this.imag += imag;

	return this;
};

Complex.prototype.subtract = function(operand) {
	var real, imag;

	if (operand instanceof Complex) {
		real = operand.real;
		imag = operand.imag;
	} else {
		real = Number(operand);
		imag = 0;
	}
	this.real -= real;
	this.imag -= imag;

	return this;
};
Complex.prototype.multiply = function(operand) {
	var real, imag, tmp;

	if (operand instanceof Complex) {
		real = operand.real;
		imag = operand.imag;
	} else {
		real = Number(operand);
		imag = 0;
	}

	tmp = this.real * real - this.imag * imag;
	this.imag = this.real * imag + this.imag * real;
	this.real = tmp;

	return this;
};

Complex.prototype.divide = function(operand) {
	var real, imag, denom, tmp;

	if (operand instanceof Complex) {
		real = operand.real;
		imag = operand.imag;
	} else {
		real = Number(operand);
		imag = 0;
	}

	denom = real * real + imag * imag;
	tmp = (this.real * real + this.imag * imag) / denom;
	this.imag = (this.imag * real - this.real * imag) / denom;
	this.real = tmp;

	return this;
};

Complex.prototype.abs = function(operand) {
  return((this.imag*this.imag + this.real*this.real)**0.5);
}
