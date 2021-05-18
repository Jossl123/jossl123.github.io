w = 300;
h = 200

scene = {}

scene.camera = {
    point: {
      	x: 0,
		y: 1.8,
	    z: 10,
    },
    fieldOfView: 45,
    vector: {
        x: 0,
        y: 3,
        z: 0,
    },
};

function setup(){
    createCanvas(w, h)
}

function draw(){
    loadPixels();
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            var index = (x + y * w) * 4
            pixels[index] = 0
            pixels[index + 1] = 0
            pixels[index + 2] = 0
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
}

class Camera{
	constructor(){
		this.pos = createVector(0, 0, 1)
	}
}

class Light{
	constructor(){
		this.pos = createVector(30, 0, -1)
	}
}