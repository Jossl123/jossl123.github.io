var w = window.innerWidth;
var h = window.innerHeight;

class World {
    constructor() {
        this.offset = [0, 0]
        this.scale = 1 / h
        this.speed = 10
    }
    getParams() {
        return [this.scale, this.offset[0], this.offset[1]]
    }
}
var world = new World()

var kernel = function(world) {
    function getColorR(a) {
        return Math.cos(a)
    }

    function getColorG(a) {
        return 1 - a
    }

    function getColorB(a) {
        return Math.sin(a)
    }

    function nextItterationX(zx, zy, constants) {
        var zr = zx * zx - zy * zy
        return zr + constants
    }

    function nextItterationY(zx, zy, constants) {
        var zi = 2 * zx * zy
        return zi + constants
    }
    var znx = (this.thread.x - this.constants.width * 0.5) * world[0] + world[1]
    var zny = (this.thread.y - this.constants.height * 0.5) * world[0] + world[2]
    var itteration = 0
    while ((znx * znx + zny * zny) < this.constants.threshold && itteration < this.constants.maxItteration) {
        var pastx = znx
        znx = nextItterationX(znx, zny, this.constants.c)
        zny = nextItterationY(pastx, zny, this.constants.c)
        itteration++;
    }
    var a = itteration / this.constants.maxItteration
    var color_r = getColorR(a);
    var color_g = getColorG(a);
    var color_b = getColorB(a);
    this.color(color_r, color_g, color_b, 1);
}
const gpu = new GPU();
const render = gpu.createKernel(kernel)
    .setOutput([w, h])
    .setConstants({
        width: w,
        height: h,
        maxItteration: 200,
        c: 0.36,
        threshold: 10
    })
    .setGraphical(true);

function setup() {}

function draw() {
    render(world.getParams())
    const canvas = render.getCanvas();
    canvas.setAttribute("id", "rendering")
    document.getElementsByTagName("body")[0].prepend(canvas)
}


document.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) {
        //fleche gauche
        world.offset[0] -= world.scale * world.speed
    }
    if (e.keyCode == 39) {
        //fleche droite
        world.offset[0] += world.scale * world.speed
    }
    if (e.keyCode == 40) {
        //fleche bas
        world.offset[1] -= world.scale * world.speed
    }
    if (e.keyCode == 38) {
        //fleche haut
        world.offset[1] += world.scale * world.speed
    }
    if (e.keyCode == 65) {
        //a
        world.scale *= 0.9
    }
    if (e.keyCode == 81) {
        //q
        world.scale *= 1.1
    }
})


setup()
setInterval(() => {
    draw()
}, 10);