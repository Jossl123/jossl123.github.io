var w = window.innerWidth;
var h = window.innerHeight;
var minRez = 20
var rez = minRez
var cam
var scene
var light
var lighting = []
var distMax = 1000
var maxStep = 40
var touchDist = 0.1
var alreadyCalculted = false

function setup() {
    createCanvas(w, h)
    cam = new Camera()
    scene = [
        new Sphere(-30, 5, 20, 10, [parseInt(random() * 250), parseInt(random(250)), 100]),
        new Sphere(10, 1, 10, 5, [parseInt(random(250)), parseInt(random(250)), 100]),
        new Sphere(2, 2, 2, 2, [parseInt(random(250)), parseInt(random(250)), 100]),
        new Sphere(0, -100, 0, 100, [parseInt(random(250)), parseInt(random(250)), 100])
    ]
    light = new Light()
    lighting.push(light)
}

function draw() {
    if (rez > 1) {
        loadPixels();
        for (let x = 0; x < w; x += rez) {
            for (let y = 0; y < h; y += rez) {
                for (let i = 0; i < minRez - rez; i++) {
                    if ((x + y * w) * 4 / (minRez - i) == minRez - i) {
                        alreadyCalculted = true;
                        break;
                    } else {
                        alreadyCalculted = false;
                    }
                }
                if (!alreadyCalculted) {
                    var newDir = createVector(x - w / 2, h / 2 - y, 0);
                    newDir = rotateVectorX(rotateVectorY(newDir, cam.ay), cam.ax)
                    newDir = cam.dir.copy().add(newDir)
                    var color = castRay(cam.pos, newDir)
                    for (let i = 0; i < rez; i++) {
                        for (let j = 0; j < rez; j++) {
                            if (x + i < w && y + j < h) {
                                var index = ((x + i) + (y + j) * w) * 4
                                pixels[index] = color[0]
                                pixels[index + 1] = color[1]
                                pixels[index + 2] = color[2]
                                pixels[index + 3] = 255;
                            }
                        }
                    }
                }
            }
        }
        updatePixels();
        rez -= 1
    }
}

//cast the ray (call for every pixels)
function castRay(origin, dir) {
    var rayResult = rayMarch(origin, dir)
        //return a color
    if (rayResult.objTouch) {
        return getLight(rayResult)
    } else {
        return [rayResult.totalDist, rayResult.totalDist, rayResult.totalDist]
    }
}

//ray march and return the distance cross and if touch obj return it and it's touch point
function rayMarch(origin, dir) {
    var totalDist = 0
    var point = origin.copy()
    var objTouch
    for (let step = 0; step < maxStep; step++) {
        var distobj = getDistToAllObj(point)
        var dist = distobj[0]
        objTouch = distobj[1]
        totalDist += dist
        if (totalDist > distMax || dist < touchDist) break;
        point.add(dir.setMag(dist))
    }
    return { point: point, objTouch: objTouch, dist: totalDist }
}

//return the shorter distance between all objects
function getDistToAllObj(point) {
    var minDist = distMax
    var objTouch
    for (let obj of scene) {
        var dist = distancePoints(obj.pos, point) - obj.r
        if (dist < minDist) {
            minDist = dist
            if (dist <= touchDist) {
                objTouch = obj
            }
        }
    }
    return [minDist, objTouch]
}

//return the normal vector of the shape (the vector which point to is front)
function getNormal(point) {
    var dist = getDistToAllObj(point)[0];
    var n = createVector(
        dist - getDistToAllObj(point.copy().sub(0.01, 0, 0))[0],
        dist - getDistToAllObj(point.copy().sub(0, 0.01, 0))[0],
        dist - getDistToAllObj(point.copy().sub(0, 0, 0.01))[0]
    )
    return n.normalize()
}

//return the color affected by the light environement
function getLight(rayResult) {
    var normal = getNormal(rayResult.point)
    var lightDir = light.pos.copy().sub(rayResult.point).normalize()
    var diff = normal.dot(lightDir)
    var rayToLight = rayMarch(rayResult.point.add(lightDir), lightDir)
    if (rayToLight.dist < distancePoints(rayResult.point, light.pos) && rayToLight.objTouch != rayResult.objTouch) {
        return mixColor(rayResult.objTouch.color, [0, 0, 0])
    }
    return mixColor(rayResult.objTouch.color, [diff * 255, diff * 255, diff * 255])
}

function mixColor(c1, c2) {
    return [(c1[0] + c2[0]) / 2, (c1[1] + c2[1]) / 2, (c1[2] + c2[2]) / 2]
}

function distancePoints(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) + (p1.z - p2.z) * (p1.z - p2.z))
}

function rotateVectorY(v, a) {
    a = a * Math.PI / 180
    var x = v.x * Math.cos(a) + v.z * Math.sin(a)
    var z = -v.x * Math.sin(a) + v.z * Math.cos(a)
    return createVector(x, v.y, z)
}

function rotateVectorX(v, a) {
    a = a * Math.PI / 180
    var y = v.y * Math.cos(a) - v.z * Math.sin(a)
    var z = v.y * Math.sin(a) + v.z * Math.cos(a)
    return createVector(v.x, y, z)
}

document.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) { //fleche gauche
        cam.pos.add(rotateVectorY(cam.dir, -90).setMag(cam.speed))
        rez = minRez
    }
    if (e.keyCode == 39) { //fleche droite
        cam.pos.add(rotateVectorY(cam.dir, 90).setMag(cam.speed))
        rez = minRez
    }
    if (e.keyCode == 40) { //fleche bas
        cam.pos.sub(cam.dir.copy().setMag(cam.speed))
        rez = minRez
    }
    if (e.keyCode == 38) { //fleche haut
        cam.pos.add(cam.dir.copy().setMag(cam.speed));
        rez = minRez
    }
    if (e.keyCode == 90) { //z key
        cam.ay += 2
        cam.dir = rotateVectorY(cam.dir, 2)
        rez = minRez
    }
    if (e.keyCode == 65) { //a key
        cam.ay -= 2
        cam.dir = rotateVectorY(cam.dir, -2)
        rez = minRez
    }
})

class Camera {
    constructor() {
        this.pos = createVector(0, 2, -10);
        this.fov = 90;
        this.dir = createVector(0, 0, 1000);
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
        this.distFromScreen = 1000;
        this.speed = 2
    }
}

class Light {
    constructor() {
        this.pos = createVector(10, 10, -10);
        this.r = 2;
        this.color = [250, 240, 240]
    }
}

class Sphere {
    constructor(x, y, z, r, color) {
        this.pos = createVector(x, y, z);
        this.r = r
        this.color = color
    }
}

class Triangle {
    constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, color){
        this.a = createVector(x1, y1, z1)
        this.b = createVector(x1, y1, z1)
        this.c = createVector(x1, y1, z1)
        this.ba = b.copy().sub(a);
        this.cb = c.copy().sub(b);
        this.ac = a.copy().sub(c);
        this.nor = this.ba.cross(this.ac)
        this.color = color
    }
    getDist(point){
        var pa = point.copy().sub(this.a)
        var pb = point.copy().sub(this.b)
        var pc = point.copy().sub(this.c)
        if (Math.sign(this.ba.cross(this.nor).dot(pa)) +
            Math.sign(this.cb.cross(this.nor).dot(pb)) +
            Math.sign(this.ac.cross(this.nor).dot(pc)) < 2){
                //test
        }else{
            //finish
        }
        return point.dot(this.pos) + 0
    }
}