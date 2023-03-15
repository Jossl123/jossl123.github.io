var scene = []
var gravity
const airResistance = 0.99
function setup() {
    createCanvas(windowWidth, windowHeight)
    gravity = createVector(0,0.0981)
    var square = squareShape(120, 500, 100, 100)
    var square2 = squareShape(100, 620, 100, 100)   
    var square3 = squareShapeWall(0, window.innerHeight-10, window.innerWidth, 100)
    scene.push(square)
    scene.push(square2)
    scene.push(square3)
    ///scene.push(bigSquareShape(400, 400, 100, 100, 4))
    for (let i = 0; i < 15; i++) {
        scene.push(squareShape(Math.random()*window.innerWidth, -i*110 + 200, Math.random()*100+10, Math.random()*100+10))
    }
    for (let i = 0; i < 15; i++) {
        scene.push(circleShape(Math.random()*window.innerWidth/3, -i*110 + 200, Math.random()*20+30,20))
    }
    fill(0)
    //frameRate(10)
}
function squareShapeWall(x, y, w, h) {
    return new Wall([
        new Point(createVector(x, y)),
        new Point(createVector(x + w, y)),
        new Point(createVector(x + w, y + h)),
        new Point(createVector(x, y + h))
    ])
}

function bigSquareShape(x, y, w, h, r, gravityActivated = true){
    var res = []
    var lrPos = createVector(x, y)
    var ratiox = w / r
    var ratioy = h / r
    for (let i = 0; i <= r; i++) {
        var npos = createVector(ratiox * i, 0)
        res.push(new Point(npos.add(lrPos)))
    }
    for (let i = r; i >= 0; i--) {
        var npos = createVector(ratiox * i, r)
        res.push(new Point(npos.add(lrPos)))
    }
    return new SoftBody(res, gravityActivated)
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
    for (let i = 1; i < s+1; i++) {
        newX = dir.x * cos(i*angle) - dir.y * sin(i*angle)
        newY = dir.x * sin(i*angle) + dir.y * cos(i*angle)
        var pos = createVector(newX, newY)
        pos.normalize().mult(r)
        pos.add(createVector(x, y))
        res.push(new Point(pos))
    }
    return new SoftBody(res, gravityActivated)
}

function draw() {
    background(255)
    scene.forEach(object => {
        object.preupdate()
    });
    scene.forEach(object => {
        object.update()
    });
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
    constructor(pos, m = 4) {
        this.id = Point.count
        Point.count++;
        this.pos = pos;
        this.newPos = pos.copy()
        this.velocity = createVector(0, 0);
        this.m = m;
        this.posFromObjCenter = createVector(0, 0)
    }
    preupdate() {
        /**
         * precalculate next pos
         */
        this.checkCollisionsWithScene()
    }
    update() {
        /**
         * change real pos
         */
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
            this.newPos.add(dir.copy().mult(1.0000000001 * (2 * (t - t ** 2)))) //1.01 is used to make sure that the point doesn't collide anymore
            closestLine[0].newPos.add(dir.copy().mult(-(1 - t)))
            closestLine[1].newPos.add(dir.copy().mult(-t))
        }else{
            this.newPos.add(dir.copy().mult(1.0000000001)) 
        }

        //recalculate velocities
        var normal = dir.normalize();

        var dn2 = normal.dot(this.velocity) * 2;
        
        this.velocity = this.velocity.sub(normal.copy().mult(dn2))  
        dn2 = normal.dot(closestLine[0].velocity) * 2;
        closestLine[0].velocity = closestLine[0].velocity.sub(normal.copy().mult(dn2 * t))
        dn2 = normal.dot(closestLine[1].velocity) * 2;
        closestLine[1].velocity = closestLine[1].velocity.sub(normal.copy().mult(dn2 * (1-t)))
    }
    draw() {
        fill(0)
        circle(this.pos.x, this.pos.y, this.m)
        this.drawVelo()
    }
    drawVelo(){
        stroke(255, 0, 0)
        line(this.pos.x, this.pos.y, this.pos.x + this.velocity.x * 10, this.pos.y + this.velocity.y*10)
    }
    angleFromObj(center){
        return this.pos.copy().sub(center).angleBetween(this.posFromObjCenter)
    }
}

class Spring{
    constructor(source, dest, stiffness = 0.1, damping = 0.1){
        this.source = source
        this.destination = dest
        this.restLength = this.length()
        this.stiffness = stiffness
        this.damping = damping
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
function randomColor() {
    return [parseInt(Math.random() * 250), parseInt(Math.random() * 250), parseInt(Math.random() * 250)]
}

class Body{
    constructor(points = [], gravityActivated = true){
        this.points = points
        this.gravityActivated = gravityActivated
        this.color = randomColor()
        this.movable = true
        var pos = this.getPosition()
        this.points.forEach(point => {
            point.posFromObjCenter = point.pos.copy().sub(pos)
        });
    }
    getPosition(){
        var finalPoint = this.points[0].pos.copy()
        for (let i = 1; i < this.points.length; i++) {
            finalPoint.add(this.points[i].pos)
        }
        finalPoint.div(this.points.length)
        return finalPoint
    }
    getAngle(){
        var pos = this.getPosition()
        var a = this.points[0].angleFromObj(pos)
        for (let i = 1; i < this.points.length; i++) {
            a+=this.points[i].angleFromObj(pos)
        }
        return -(a / this.points.length)
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
    preupdate(){
        this.points.forEach(point =>{
            if (this.gravityActivated) point.velocity.add(gravity);
            point.preupdate()
        })
    }
    update(){
        this.points.forEach(point => {
            point.update()
        });
    }
    debugDraw(){
        for (let i = 0; i < this.points.length; i++) {
            var points = this.getLine(i)
            if (this.movable)points[0].draw()
            stroke(0)
            line(points[0].pos.x, points[0].pos.y, points[1].pos.x, points[1].pos.y)
        }
    }
    coloredDraw(){
        smooth();
        strokeWeight(2);    
        stroke(this.color[0]*0.8, this.color[1]*0.8, this.color[2]*0.8);
        fill(this.color[0], this.color[1], this.color[2]);
        
        beginShape();
        for (let i = 0; i < this.points.length; i++) {
            var points = this.getLine(i)
            vertex(points[0].pos.x, points[0].pos.y)
        }
        endShape(CLOSE);
    }
    draw(){
        this.coloredDraw()
    }
}
class SoftBody extends Body{
    constructor(points = [], gravityActivated = true){
        super(points, gravityActivated)
        this.plainBody = []
        this.springs = []
        this.generatelinkToEveryOne()
    }
    generatelinkToEveryOne(){
        for (let i = 0; i < this.points.length; i++) {
            this.plainBody.push(new Point(this.points[i].pos));
            for (let j = i+1; j < this.points.length; j++) {
                this.springs.push(new Spring(this.points[i], this.points[j]))
            }
            this.springs.push(new Spring(this.points[i], this.plainBody[i], 0.5, 0.8))
        }
    }
    preupdate(){
        super.preupdate()
        this.springs.forEach(spring => {
            spring.update()            
        });
    }
    updateRelativePoints(){
        var pos = this.getPosition()
        //circle(pos.x, pos.y, 5)
        var a = this.getAngle()
        for (let i = 0; i < this.plainBody.length; i++) {
            var np = pos.copy().add(rotateVector(this.points[i].posFromObjCenter, a))
            this.plainBody[i].pos = np.copy()
            stroke(255, 0, 0)
            //circle(np.x, np.y, 5)
        }
    }
    update(){
        this.updateRelativePoints()
        super.update()
        this.springs.forEach(spring => {
            spring.update()            
        });
    }
}

function rotateVector(v, a){
    newX = v.x * cos(a) - v.y * sin(a)
    newY = v.x * sin(a) + v.y * cos(a)
    return createVector(newX, newY)
}
class Wall extends Body{
    constructor(points = []){
        super(points, false)
        this.movable = false
    }
    update(){
        return 
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
        return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
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