var scene = []
var gravity

function setup() {
    createCanvas(windowWidth, windowHeight)
    gravity = createVector(0, 1)
    var square = squareShape(10, 10, 100, 100)
    var square2 = squareShape(200, 100, 80, 100)
    scene.push(square)
    scene.push(square2)
}

function squareShape(x, y, w, h) {
    return [
        new Point(createVector(x, y)),
        new Point(createVector(x + w, y)),
        new Point(createVector(x + w, y + h)),
        new Point(createVector(x, y + h))
    ]
}

function updateScene() {
    scene.forEach(object => {
        for (let i = 0; i < object.length; i++) {
            var point = object[i];
            point.update()
        }
    });
}

function draw() {
    background(255)
    updateScene()
    scene.forEach(object => {
        for (let i = 0; i < object.length; i++) {
            var point = object[i];
            point.draw()
            var nexti = i + 1
            if (nexti >= object.length) nexti = 0;
            var nextPoint = object[nexti];
            line(point.pos.x, point.pos.y, nextPoint.pos.x, nextPoint.pos.y)
        }
    });
}

class Point {
    constructor(pos, velocity = createVector(0, 0), m = 10) {
        this.pos = pos;
        this.velocity = velocity;
        this.m = m
    }
    update() {
        this.velocity.add(gravity);

        this.checkCollisionsWithScene()

        this.pos.add(this.velocity);
    }
    checkCollisionsWithScene() {
        scene.forEach(object => {
            for (let i = 0; i < object.length; i++) {

            }
        });
    }
    draw() {
        circle(this.pos.x, this.pos.y, this.m)
    }
}

function getObjectBox(object) {
    var res = { minx: 0, miny: 0, maxx: 0, maxy: 0 }
    if (object.length == 0) return res
    res = { minx: object[0].x, miny: object[0].y, maxx: object[0].x, maxy: object[0].y }
    for (let i = 0; i < object.length; i++) {
        var point = object[i];
        res = {
            minx: Math.min(point.x, res.minx),
            miny: Math.min(point.y, res.miny),
            maxx: Math.max(point.x, res.maxx),
            maxy: Math.max(point.y, res.maxy)
        }
    }
    return res
}