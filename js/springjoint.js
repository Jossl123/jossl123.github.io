var scene = []
var gravity
const airResistance = 9.81*10**-1   
function setup() {
    createCanvas(windowWidth, windowHeight)
    gravity = createVector(0, 0.5)
    var square = squareShape(120, 10, 100, 100)
    var square2 = squareShape(100, 120, 100, 100)   
    var square3 = squareShapeWall(0, 900, 1500, 1400)
    scene.push(square)
    scene.push(square2)
    scene.push(square3)
    for (let i = 0; i < 20; i++) {
        scene.push(squareShape(Math.random()*1000, Math.random()*4000-4000, Math.random()*100+10, Math.random()*100+10))
    }
    for (let i = 0; i < 20; i++) {
        scene.push(circleShape(Math.random()*1000, Math.random()*4000-4000, Math.random()*100+10, Math.random()*10+10))
    }
    scene
    fill(0)
    //frameRate(3)
}
function squareShapeWall(x, y, w, h) {
    return new Wall([
        new Point(createVector(x, y)),
        new Point(createVector(x + w, y)),
        new Point(createVector(x + w, y + h)),
        new Point(createVector(x, y + h))
    ])
}

function squareShape(x, y, w, h, gravityActivated = true) {
    return new SoftBody([
        new Point(createVector(x, y)),
        new Point(createVector(x + w, y)),
        new Point(createVector(x + w, y + h)),
        new Point(createVector(x, y + h))
    ], gravityActivated)
}
function circleShape(x, y, r, s, gravityActivated = true) {
    var dir = createVector(1, 0)
    var res = []
    var angle = Math.PI * 2 / s
    for (let i = 0; i < s-1; i++) {
        newX = dir.x * cos(i*angle) - dir.y * sin(i*angle)
        newY = dir.x * sin(i*angle) + dir.y * cos(i*angle)
        var pos = createVector(newX, newY)
        pos.mult(r)
        pos.add(createVector(x, y))
        res.push(new Point(pos))
    }
    return new SoftBody(res, gravityActivated)
}

function updateScene() {
    scene.forEach(object => {
        object.update()
    });
}

function draw() {
    background(255)
    updateScene()
    scene.forEach(object => {
        object.draw()
    });
}
function pointInObj(object, point) {
    return object.some(function(el) {
        return el.id === point.id;
    });
}
class Point {
    static count = 0;
    constructor(pos, m = 10) {
        this.id = Point.count
        Point.count++;
        this.pos = pos;
        this.newPos = pos.copy()
        this.velocity = createVector(0, 0);
        this.m = m;
    }
    calculateNewVelo() {
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
            if (pointInObj(object.points, this)) this.selfCollision(object)
            var objBox = object.getObjectBox();
            var outsidePoint = createVector(objBox.minx - 10, this.pos.y)
            var touch = 0
            //TODO : check first if point is in objbox
            for (let i = 0; i < object.points.length; i++) {
                var points = object.getLine(i)
                if (lineIntersects(points[0].pos, points[1].pos, this.pos, outsidePoint)) touch++
            }
            //the point is inside the object
            if (touch % 2 == 1) this.collide(object)
        };
    }
    selfCollision(object){
        object.points.forEach(point => {
            if (dist(point.pos.x, point.pos.y, this.pos.x, this.pos.y) < this.m + point.m){
                var normal = this.pos.copy().sub(point.pos).normalize();
                var dn2 = normal.dot(this.velocity) * 2;
                this.velocity = this.velocity.sub(normal.copy().mult(dn2))  
            }
        })
    }
    collide(object) {
        var minDist = dist2(object.points[0].pos, this.pos)
        var closestLine =object.getLine(0)
        for (let i = 0; i < object.points.length; i++) {
            var points = object.getLine(i)
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
        if (object.movable){
            dir.div(2)
            this.newPos.add(dir.copy().mult(1.0000001 * (2 * (t - t ** 2)))) //1.01 is used to make sure that the point doesn't collide anymore
            closestLine[0].newPos.add(dir.copy().mult(-(1 - t)))
            closestLine[1].newPos.add(dir.copy().mult(-t))
        }else{
            this.newPos.add(dir.copy().mult(1.0000001)) 
        }

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

class Spring{
    constructor(source, dest){
        this.source = source
        this.destination = dest
        this.restLength = this.length()
        this.stiffness = 0.1
        this.damping = 0.1  
    }
    length(){
        return dist(this.destination.pos.x, this.destination.pos.y, this.source.pos.x, this.source.pos.y)
    }
    update(){
        var fs = (this.length() - this.restLength) * this.stiffness 
        var dir = this.destination.pos.copy().sub(this.source.pos).normalize()
        var vel = this.destination.velocity.copy().sub(this.source.velocity)
        var fd = vel.dot(dir) * this.damping

        var finalForce = fs + fd

        this.source.velocity.add(dir.copy().mult(finalForce))
        this.destination.velocity.add(dir.copy().mult(-finalForce))
    }
}

class Body{
    constructor(points = [], gravityActivated = true){
        this.points = points
        this.gravityActivated = gravityActivated
        this.movable = true
    }
    getObjectBox() {
        var res = { minx: 0, miny: 0, maxx: 0, maxy: 0 }
        if (this.points.length == 0) return res
        res = { minx: this.points[0].pos.x, miny: this.points[0].pos.y, maxx: this.points[0].pos.x, maxy: this.points[0].pos.y }
        for (let i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            res = {
                minx: Math.min(point.pos.x, res.minx),
                miny: Math.min(point.pos.y, res.miny),
                maxx: Math.max(point.pos.x, res.maxx),
                maxy: Math.max(point.pos.y, res.maxy)
            }
        }
        return res
    }
    getLine(i){
        var point = this.points[i];
        var nexti = i + 1
        if (nexti >= this.points.length) nexti = 0;
        var nextPoint = this.points[nexti];
        return [point, nextPoint]
    }
    updateVelocities(){
        this.points.forEach(point =>{
            point.calculateNewVelo()
            if (this.gravityActivated) point.velocity.add(gravity);
        })
    }
    update(){
        this.points.forEach(point => {
            point.update()
        });
    }
    draw(){
        for (let i = 0; i < this.points.length; i++) {
            var points = this.getLine(i)
            if (this.movable)points[0].draw()
            line(points[0].pos.x, points[0].pos.y, points[1].pos.x, points[1].pos.y)
        }
    }
}
class SoftBody extends Body{
    constructor(points = [], gravityActivated = true){
        super(points, gravityActivated)
        this.springs = []
        this.generatelinkToEveryOne()
    }
    generatelinkToEveryOne(){
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i+1; j < this.points.length; j++) {
                this.springs.push(new Spring(this.points[i], this.points[j]))
            }
        }
    }
    update(){
        super.updateVelocities()
        this.springs.forEach(spring => {
            spring.update()            
        });
        super.update()
    }
}
class Wall extends Body{
    constructor(points = []){
        super(points, false)
        this.movable = false
    }
    update(){
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