var w = window.innerWidth;
var h = window.innerHeight;
var rez = 20
var cam
var scene
var light
var lighting = []

function setup() {
    createCanvas(w, h)
    cam = new Camera()
    scene = [
        new Sphere(-30, 5, 20, 10),
        new Sphere(10, 1, 10, 5),
        new Sphere(2, 2, 2, 2)
    ]
    light = new Light()
    lighting.push(light)
}

function draw() {
    if (rez > 0) {
        loadPixels();
        for (let x = 0; x < w; x += rez) {
            for (let y = 0; y < h; y += rez) {
                var ax = parseInt(-cam.fov / 2) + (cam.fov * x / w);
                var ay = parseInt(-(h * cam.fov / w) / 2) + ((h * cam.fov / w) * y / h)
                var color = castRay(cam.pos, rotateVectorX(rotateVectorY(cam.dir, ax), ay))
                for (let i = 0; i < rez; i++) {
                    for (let j = 0; j < rez; j++) {
                        var index = ((x + i) + (y + j) * w) * 4
                        pixels[index] = color[0]
                        pixels[index + 1] = color[1]
                        pixels[index + 2] = color[2]
                        pixels[index + 3] = 255;
                    }
                }
            }
        }
        updatePixels();
        rez -= 1
    }
}


class Camera {
    constructor() {
        this.pos = createVector(0, 2, -10);
        this.fov = 90;
        this.dir = createVector(0, 0, 1);
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
    constructor(x, y, z, r) {
        this.pos = createVector(x, y, z);
        this.r = r
        this.color = [100, 200, 0]
    }
}

document.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) {
        cam.pos.add(-1, 0, 0)
        rez = 20
    }
    if (e.keyCode == 39) {
        cam.pos.add(1, 0, 0)
        rez = 20
    }
    if (e.keyCode == 40) {
        cam.pos.add(0, 0, -1)
        rez = 20
    }
    if (e.keyCode == 38) {
        cam.pos.add(0, 0, 1)
        rez = 20
    }
    if (e.keyCode == 90) { //z
        cam.dir.add(0.1, 0, 0)
        rez = 20
    }
    if (e.keyCode == 65) {
        cam.dir.add(-0.1, 0, 0)
        rez = 20
    }
})

function castRay(origin, dir) {
    var distmax = 1000;
    var minDist = distmax
    var totalDist = 0
    var objTouch
    var currentPoint = origin.copy()
    while (totalDist < distmax && minDist > 1) {
        minDist = distmax
        for (let obj of scene) {
            var dist = distancePoints(obj.pos, currentPoint) - obj.r
            if (dist < minDist) {
                minDist = dist
            }
            if (minDist <= 1) {
                objTouch = obj
            }
        }
        currentPoint.add(dir.setMag(minDist))
        totalDist += minDist
    }
    if (objTouch) {
        //if we touch obj
        return shadow(currentPoint, objTouch)
    } else {
        //bg color
        if (dir.y > 0) {
            return [12, 12, 54]
        } else {
            return [0, 120, 54]
        }
    }
}

function shadow(p, objTouch) {
    for (let obj of scene) {
        var dist = hitSphere(obj.pos, obj.r, p, light.pos.copy().sub(p))
        if (dist != -1) {
            return [obj.r * 2 / dist * 250, obj.r * 2 / dist * 250, obj.r * 2 / dist * 250]
        }
    }
    return objTouch.color
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

function hitSphere(center, radius, origin, dir) {
    var oc = origin.copy().sub(center);
    var a = dir.dot(dir);
    var b = 2 * oc.dot(dir);
    var c = oc.dot(oc) - radius * radius;
    var discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return -1;
    } else {
        var numerator1 = -b - Math.sqrt(discriminant);
        var numerator2 = -b + Math.sqrt(discriminant);
        if (numerator1 > 0 && numerator2 > 0) {
            return Math.abs(((numerator1 / (2 * a)) - (numerator2 / (2 * a))));
        } else {
            return -1;
        }
    }
}