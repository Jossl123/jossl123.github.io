var scene = []
var gravity
const airResistance = 0.98
function setup() {
    createCanvas(windowWidth, windowHeight)
    gravity = createVector(0, 0.5)
    var square = squareShape(120, 10, 100, 100)
    var square2 = squareShape(300, 50, 80, 100)
    var square3 = squareShape(100, 400, 300, 500, false)
    scene.push(square)
    scene.push(square2)
    scene.push(square3)
    fill(0)
    //frameRate(10)
}

function squareShape(x, y, w, h, gravityActivated = true) {
    return new SoftBody([
        new Point(createVector(x, y), gravityActivated),
        new Point(createVector(x + w, y), gravityActivated),
        new Point(createVector(x + w, y + h), gravityActivated),
        new Point(createVector(x, y + h), gravityActivated)
    ])
}

function updateScene() {
    scene.forEach(object => {
        for (let i = 0; i < object.points.length; i++) {
            object.points[i].calculateNewVelo();
        }
    });
    scene.forEach(object => {
        for (let i = 0; i < object.points.length; i++) {
            object.points[i].update();
        }
    });
}

function draw() {
    background(255)
    console.log("__________")
    updateScene()
    scene.forEach(object => {
        for (let i = 0; i < object.points.length; i++) {
            var points = getLine(object.points, i)
            points[0].draw()
            line(points[0].pos.x, points[0].pos.y, points[1].pos.x, points[1].pos.y)
        }
    });
}

function getLine(object, i) {
    var point = object[i];
    var nexti = i + 1
    if (nexti >= object.length) nexti = 0;
    var nextPoint = object[nexti];
    return [point, nextPoint]
}

function pointInObj(object, point) {
    return object.some(function(el) {
        return el.id === point.id;
    });
}
class Point {
    static count = 0;
    constructor(pos, gravityActivated = true, m = 10) {
        this.id = Point.count
        Point.count++;
        this.pos = pos;
        this.newPos = pos.copy()
        this.velocity = createVector(0, 0);
        this.m = m;
        this.gravityActivated = gravityActivated
    }
    calculateNewVelo() {
        if (this.gravityActivated) this.velocity.add(gravity);
        this.checkCollisionsWithScene()
    }
    update() {
        this.velocity.mult(airResistance)
        this.newPos.add(this.velocity);
        this.pos = this.newPos.copy()
    }
    checkCollisionsWithScene() {
        for (var i = 0; i < scene.length; i++) {
            var object = scene[i];
            if (pointInObj(object.points, this)) continue
            var objBox = getObjectBox(object.points);
            var outsidePoint = createVector(objBox.minx - 10, this.pos.y)
            var touch = 0
            //TODO : check first if point is in objbox
            for (let i = 0; i < object.points.length; i++) {
                var points = getLine(object.points, i)
                if (lineIntersects(points[0].pos, points[1].pos, this.pos, outsidePoint)) touch++
            }
            //the point is inside the object
            if (touch % 2 == 1) this.collide(object)
        };
    }
    collide(object) {
        var minDist = dist2(object.points[0].pos, this.pos)
        var closestLine = getLine(object.points, 0)
        for (let i = 0; i < object.points.length; i++) {
            var points = getLine(object.points, i)
            var dist = distToSegment(this.pos, points[0].pos, points[1].pos)
            if (dist < minDist) {
                minDist = dist
                closestLine = points
            }
        }
        var t = pointToSegmentProjection(this.pos, closestLine[0].pos, closestLine[1].pos)
        var castedPoint = closestLine[0].pos.copy().add(closestLine[1].pos.copy().sub(closestLine[0].pos).mult(t));

        //move point and line so that the point is not inside object anymore
        //TODO : make it relative to masses
        var dir = castedPoint.sub(this.pos)
        dir.div(2)
        this.newPos.add(dir.copy().mult(1.01 * (2 * (t - t ** 2)))) //1.01 is used to make sure that the point doesn't collide anymore

        closestLine[0].newPos.add(dir.copy().mult(-(1 - t)))
        closestLine[1].newPos.add(dir.copy().mult(-t))

        //recalculate velocities
        var normal = dir.normalize();

        var dn2 = normal.dot(this.velocity) * 2;
        
        this.velocity = this.velocity.sub(normal.copy().mult(dn2))  
        dn2 = normal.dot(closestLine[0].velocity) * 2;
        closestLine[0].velocity = closestLine[0].velocity.sub(normal.copy().mult(dn2))
        dn2 = normal.dot(closestLine[1].velocity) * 2;
        closestLine[1].velocity = closestLine[1].velocity.sub(normal.copy().mult(dn2))
    }
    draw() {
        fill(0)
        circle(this.pos.x, this.pos.y, this.m)
    }
}

class SoftBody{
    constructor(points = []){
        this.points = points
        this.springs = []
    }
}

function lineIntersects(v1, v2, v3, v4) {
    var det, gamma, lambda;
    det = (v2.x - v1.x) * (v4.y - v3.y) - (v4.x - v3.x) * (v2.y - v1.y);
    if (det === 0) {
        return false;
    } else {
        lambda = ((v4.y - v3.y) * (v4.x - v1.x) + (v3.x - v4.x) * (v4.y - v1.y)) / det;
        gamma = ((v1.y - v2.y) * (v4.x - v1.x) + (v2.x - v1.x) * (v4.y - v1.y)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

function getObjectBox(object) {
    var res = { minx: 0, miny: 0, maxx: 0, maxy: 0 }
    if (object.length == 0) return res
    res = { minx: object[0].pos.x, miny: object[0].pos.y, maxx: object[0].pos.x, maxy: object[0].pos.y }
    for (let i = 0; i < object.length; i++) {
        var point = object[i];
        res = {
            minx: Math.min(point.pos.x, res.minx),
            miny: Math.min(point.pos.y, res.miny),
            maxx: Math.max(point.pos.x, res.maxx),
            maxy: Math.max(point.pos.y, res.maxy)
        }
    }
    return res
}


function sqr(x) { return x * x }

function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }

function pointToSegmentProjection(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    return Math.max(0, Math.min(1, t));
}

function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = pointToSegmentProjection(p, v, w)
    return dist2(p, {
        x: v.x + t * (w.x - v.x),
        y: v.y + t * (w.y - v.y)
    });
}

function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }