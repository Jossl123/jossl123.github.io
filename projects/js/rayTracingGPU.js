var w = window.innerWidth;
var h = window.innerHeight;

var world

function setup() {
    class World {
        constructor() {
            const myImg = new Image();
            myImg.crossOrigin = "Anonymous";
            this.skyBox = undefined
            myImg.onload = () => {
                this.skyBox = document.createElement('canvas').getContext('2d');
                this.skyBox.canvas.width = myImg.width
                this.skyBox.canvas.height = myImg.height
                this.skyBox.drawImage(myImg, 0, 0);
            }
            myImg.src = './img/skyboxTown.jpg';

            this.cam = new Camera()
        }
        getParams() {
            return [
                [this.cam.pos.x, this.cam.pos.y, this.cam.pos.z, this.skyBox]
            ]
        }
    }
    var kernel = function(world) {
        var color_r = 1;
        var color_g = 1;
        var color_b = 1;
        var color = skyLight(this.thread.x, this.thread.y, 1, world[0][3])
        this.color(color_r, color_g, color_b, 1);
    }

    const gpu = new GPU().addFunction(skyLight);
    const render = gpu.createKernel(kernel)
        .setOutput([w, h])
        .setGraphical(true);
    world = new World()
    render(world.getParams())
    const canvas = render.getCanvas();
    canvas.setAttribute("id", "rendering")
    document.getElementsByTagName("body")[0].prepend(canvas)
}

function skyLight(x, y, z, img) {
    var u = 0.5 + Math.atan2(z, x) / (2 * Math.PI)
    var v = 0.5 + Math.asin(-y) / Math.PI
    color = img.getImageData(Math.floor(u * myImg.width), Math.floor(v * myImg.height), 1, 1).data
    return [color[0], color[1], color[2]]
}

function draw() {
    render(world.getParams())
}