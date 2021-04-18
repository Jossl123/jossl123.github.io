var points = []
var qtree;
var player;

function setup() {
    createCanvas(windowWidth, windowHeight);
    var boundaries = new Rectangle(0, 0, width, height)
    qtree = new Quadtree(boundaries, 4)
}

function draw() {
    background(255)
    for (let i = 0; i < points.length; i++) {
        points[i].render()
    }
    if (mouseIsPressed) {
        points.push(new Point(mouseX, mouseY, 4))
        qtree.insert(points[points.length - 1])
    }
    qtree.show()
}

class Player {
    constructor() {
        this.position = createVector(random(width), random(height))
        this.ray = p5.Vector.random2D()
        this.rotateAngle = 0.004
    }
    update() {
        this.show()
        this.drawRay()
        this.ray.x = Math.cos(this.rotateAngle) * this.ray.x - Math.sin(this.rotateAngle) * this.ray.y
        this.ray.y = Math.sin(this.rotateAngle) * this.ray.x + Math.cos(this.rotateAngle) * this.ray.y
    }
    show() {
        strokeWeight(10)
        stroke(150)
        point(this.position.x, this.position.y)
    }
    drawRay() {
        strokeWeight(3)
        var len = createVector(windowWidth, windowHeight).mag()
        this.ray.setMag(len)
        line(this.position.x, this.position.y, this.position.x + this.ray.x, this.position.y + this.ray.y)
    }
}

class Obstacle {
    constructor() {
        this.position = createVector(random(width), random(height))
        this.radius = random(20, 100)
    }
    show() {
        strokeWeight(this.radius)
        stroke(100)
        point(this.position.x, this.position.y)
    }
}