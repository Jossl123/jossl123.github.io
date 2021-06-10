var w = window.innerWidth;
var h = window.innerHeight;
var minRez = 20
var rez = minRez
var cam
var scene
var light
var distMax = 1000
var maxStep = 40
var touchDist = 0.1
var planeDist = 0
var alreadyCalculted = false

function setup() {
    createCanvas(w, h)
    cam = new Camera()
    scene = [
        new Sphere(-30, 5, 20, 10, [parseInt(random() * 250), parseInt(random(250)), 100]),
        new Cube(-10, -8, 50, 5, 5, 5, [parseInt(random(250)), parseInt(random(250)), 100]),
        new Sphere(2, 2, 2, 2, [parseInt(random(250)), parseInt(random(250)), 100]),
        //heart
        // new Sphere(0, 0, 100, 15, [255, 10, 10]),
        // new Sphere(-5, 5, 100, 15, [255, 10, 10]),
        // new Sphere(5, 5, 100, 15, [255, 10, 10]),
        // new Sphere(-10, 10, 100, 15, [255, 10, 10]),
        // new Sphere(10, 10, 100, 15, [255, 10, 10]),
        // new Sphere(-15, 15, 100, 15, [255, 10, 10]),
        // new Sphere(15, 15, 100, 15, [255, 10, 10]),
        // new Sphere(-20, 20, 100, 15, [255, 10, 10]),
        // new Sphere(20, 20, 100, 15, [255, 10, 10]),
        // new Sphere(-15, 30, 100, 15, [255, 10, 10]),
        // new Sphere(15, 30, 100, 15, [255, 10, 10]),
        // new Sphere(-10, 25, 100, 15, [255, 10, 10]),
        // new Sphere(10, 25, 100, 15, [255, 10, 10]),
        // new Sphere(0, 15, 100, 15, [255, 10, 10]),
        //coca...
        // new Sphere(0, 20, 120, 10, [255, 30, 50]),
        // new Sphere(0, 15, 125, 10, [255, 30, 50]),
        // new Sphere(0, 10, 130, 10, [255, 30, 50]),
        // new Sphere(0, 5, 135, 10, [255, 30, 50]),
        // new Sphere(0, 0, 140, 10, [255, 30, 50]),
        // new Sphere(0, -5, 145, 10, [255, 30, 50]),
        // new Sphere(15, -10, 150, 10, [255, 30, 50]),
        // new Sphere(-15, -10, 150, 10, [255, 30, 50]),
        // //bubble
        // new Sphere(0, 32, 115, 3, [255, 255, 255]),
        // new Sphere(0, 35, 113, 3, [255, 255, 255]),
        //floor
        new Sphere(0, -100, 140, 70, [parseInt(random(250)), parseInt(random(250)), 100])
    ]
    light = new Light()
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
    // light.pos.x = sin(frameCount / 10) * 100
    // light.pos.z = cos(frameCount / 10) * 100 + 50
}

//cast the ray (call for every pixels)
function castRay(origin, dir) {
    var rayResult = rayMarch(origin, dir)
        //return a color
    if (rayResult.objTouch) {
        return getLight(rayResult)
    } else {
        return [200, 200, 200]
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
        var dist = obj.getDist(point)
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

function length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
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
        this.pos = createVector(0, 5, -10);
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
        this.pos = createVector(10, 40, 70);
        this.r = 2;
        this.color = [250, 30, 30]
    }
}

class Sphere {
    constructor(x, y, z, r, color) {
        this.pos = createVector(x, y, z);
        this.r = r
        this.color = color
    }
    getDist(point) {
        return distancePoints(this.pos, point) - this.r
    }
}

class Cube {
    constructor(x, y, z, w, h, depth, color) {
        this.pos = createVector(x, y, z);
        this.size = createVector(w, h, depth)
        this.color = color
    }
    getDist(point) {
        var q = absVector(point.copy().sub(this.pos)).sub(this.size)
        return length(maxVector(q, createVector(0, 0, 0))) + Math.min(Math.max(q.x, Math.max(q.y, q.z)), 0);
    }
}

class RoundedCube {
    constructor(x, y, z, w, h, depth, r, color) {
        this.pos = createVector(x, y, z);
        this.size = createVector(w, h, depth)
        this.r = r
        this.color = color
    }
    getDist(point) {
        var q = absVector(point.copy().sub(this.pos)).sub(this.size)
        return length(maxVector(q, createVector(0, 0, 0))) + Math.min(Math.max(q.x, Math.max(q.y, q.z)), 0) - this.r;
    }
}

function absVector(v) {
    return createVector(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z))
}

function maxVector(v1, v2) {
    return createVector(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y), Math.max(v1.z, v2.z))
}

function minVector(v1, v2) {
    return createVector(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y), Math.min(v1.z, v2.z))
}