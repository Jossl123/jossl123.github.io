var scene = []
var gravity

function setup() {
    createCanvas(windowWidth, windowHeight)
    gravity = createVector(0, 0.5)
    var square = squareShape(200, 10, 100, 100)
        //var square2 = squareShape(250, 50, 80, 100)
    var square3 = squareShape(100, 400, 300, 500, false)
    scene.push(square)
        //scene.push(square2)
    scene.push(square3)
    fill(0)
    frameRate(30)
}

function squareShape(x, y, w, h, gravityActivated = true) {
    return [
        new Point(createVector(x, y), gravityActivated),
        new Point(createVector(x + w, y), gravityActivated),
        new Point(createVector(x + w, y + h), gravityActivated),
        new Point(createVector(x, y + h), gravityActivated)
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
    console.log("__________")
    updateScene()
    scene.forEach(object => {
        for (let i = 0; i < object.length; i++) {
            var points = getLine(object, i)
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
        this.velocity = createVector(0, 0);
        this.m = m;
        this.gravityActivated = gravityActivated
    }
    update() {
        if (this.gravityActivated) this.velocity.add(gravity);

        this.checkCollisionsWithScene()

        this.pos.add(this.velocity);
    }
    checkCollisionsWithScene() {
        for (var i = 0; i < scene.length; i++) {
            var object = scene[i];
            if (pointInObj(object, this)) continue
            var objBox = getObjectBox(object);
            var outsidePoint = createVector(objBox.minx - 10, this.pos.y)
            var touch = 0
            for (let i = 0; i < object.length; i++) {
                var points = getLine(object, i)
                if (lineIntersects(points[0].pos, points[1].pos, this.pos, outsidePoint)) touch++
            }
            //the point is inside the object
            if (touch % 2 == 1) this.collide(object)
        };
    }
    collide(object) {
        var minDist = dist2(object[0].pos, this.pos)
        var closestLine = getLine(object, 0)
        for (let i = 0; i < object.length; i++) {
            var points = getLine(object, i)
            var dist = distToSegment(this.pos, points[0].pos, points[1].pos)
            if (dist < minDist) {
                minDist = dist
                closestLine = points
            }
        }
        var t = pointToSegmentProjection(this.pos, closestLine[0].pos, closestLine[1].pos)
        var castedPoint = closestLine[0].pos.copy().add(closestLine[1].pos.copy().sub(closestLine[0].pos).mult(t))
            //recalculate velocities
        var opponentsVelocity = closestLine[0].velocity.copy().add(closestLine[1].velocity).div(2)
        var normal = castedPoint.copy()
        this.velocity.mult(-0.8)
        closestLine[0].velocity.mult(-0.8)
        closestLine[1].velocity.mult(-0.8)

        //TODO : make it relative to masses and t value
        var dir = castedPoint.sub(this.pos)
        dir.div(2)
        this.pos.add(dir)
        dir.mult(-1)
        closestLine[0].pos.add(dir)
        closestLine[1].pos.add(dir)
    }
    draw() {
        fill(0)
        circle(this.pos.x, this.pos.y, this.m)
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