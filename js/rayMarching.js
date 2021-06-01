var obstacles = []
var obstaclesNb = 20
var player;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < obstaclesNb; i++) {
        obstacles.push(new Obstacles())
    }
    player = new Player()
}

function draw() {
    background(40)
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].render()
    }
    player.update()
}

class Player {
    constructor() {
        this.position = createVector(mouseX, mouseY)
        this.radius = 20
        this.ray = p5.Vector.random2D()
        this.rotateAngle = 0.004
    }
    update() {
        this.show()
        this.drawRay()
        this.ray.x = Math.cos(this.rotateAngle) * this.ray.x - Math.sin(this.rotateAngle) * this.ray.y
        this.ray.y = Math.sin(this.rotateAngle) * this.ray.x + Math.cos(this.rotateAngle) * this.ray.y
        this.position = createVector(mouseX, mouseY)
        this.pointChild = new Point(this.position.x, this.position.y, this.ray)
    }
    show() {
        strokeWeight(this.radius)
        stroke(255)
        point(this.position.x, this.position.y)
    }
    drawRay() {
        stroke(200)
        strokeWeight(1)
        var len = createVector(windowWidth, windowHeight).mag()
        this.ray.setMag(len)
        line(this.position.x, this.position.y, this.position.x + this.ray.x, this.position.y + this.ray.y)
    }
}

class Point {
    constructor(x, y, ray) {
        this.position = createVector(x, y)
        this.radius = 4
        this.ray = ray
        this.show()
        this.rayCast()
    }
    show() {
        strokeWeight(this.radius)
        stroke(200)
        point(this.position.x, this.position.y)
    }
    rayCast() {
        var diag = createVector(windowWidth, windowHeight).mag()
        var minDist = diag
        for (let obstacle of obstacles) {
            var distance = dist(this.position.x, this.position.y, obstacle.position.x, obstacle.position.y) - obstacle.radius / 2;
            if (distance <= this.radius / 2) {
                minDist = 0
            } else if (distance < minDist) {
                minDist = distance
            }
        }
        stroke(200)
        strokeWeight(1)
        fill('rgba(200,200,200, 0.10)')
        circle(this.position.x, this.position.y, minDist * 2)
        if (minDist < diag) {
            if (minDist >= 0.01) {
                this.ray.setMag(minDist)
                var newPos = createVector(this.position.x + this.ray.x, this.position.y + this.ray.y)
                new Point(newPos.x, newPos.y, this.ray)
            } else {
                stroke(200, 0, 0)
                strokeWeight(10)
                point(this.position.x, this.position.y)
            }
        }
    }
}

class Obstacles {
    constructor() {
        this.position = createVector(random(width), random(height))
        this.radius = random(20, 100)
    }
    render() {
        strokeWeight(0)
        fill(0)
        circle(this.position.x, this.position.y, this.radius)
    }
}