var wSize = 200;
var hSize = 100;
var wTileSize
var hTileSize
var scene = []
var objs = []
var maxView = 1000
var fovX = 100
var fovY = 60

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES)
    wTileSize = width / wSize;
    hTileSize = height / hSize;
    objs.push(new Sphere(302, 1, 3, 1));
    for (let x = 0; x < wSize; x++) {
        scene[x] = []
        for (let y = 0; y < hSize; y++) {
            var pointPos = createVector(0, 0, 0)
            var pointColor = color(0, 0, 0);
            var pointDir = createVector(0, 0, 1)
            pointDir = rotateVectorY(pointDir, -(fovX / wSize * x) * Math.PI / 180)
            pointDir = rotateVectorX(pointDir, -(fovY / hSize * y) * Math.PI / 180)
            console.log(pointDir)
            var minDist = maxView
            var totalDist = 0
            while (totalDist <= maxView && minDist > 0.1) {
                var dist = maxView
                for (let obj of objs) {
                    dist = vectorLength(pointPos, obj.pos) - obj.radius
                    if (dist < minDist) {
                        minDist = dist
                    }
                    totalDist += dist
                }
                pointPos.add(pointDir.setMag(minDist))
            }
            if (minDist < 0.1) {
                pointColor = color(255, 0, 0)
            }
            scene[x][y] = pointColor
        }
    }
    loadPixels();
    for (let x = 0; x < width; x++) {
        var xindex = Math.trunc(x / wTileSize)
        for (let y = 0; y < height; y++) {
            var index = (x + y * width) * 4
            var yindex = Math.trunc(y / hTileSize)
            pixels[index] = scene[xindex][yindex].levels[0];
            pixels[index + 1] = scene[xindex][yindex].levels[1];
            pixels[index + 2] = scene[xindex][yindex].levels[2];
            pixels[index + 3] = 255;
        }
    }
    updatePixels()
}

class Sphere {
    constructor(x, y, z, r) {
        this.color = color(255, 204, 0);
        this.pos = createVector(x, y, z);
        this.radius = r;
    }
}

class Light {
    constructor(x, y, z) {
        this.pos = createVector(x, y, z)
    }
}

function vectorLength(v1, v2) {
    return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) + (v1.z - v2.z) * (v1.z - v2.z))
}

function rotateVectorZ(v, angle) {
    return createVector(v.x * Math.cos(angle) - v.y * Math.sin(angle), v.x * Math.sin(angle) + v.y * Math.cos(angle), v.z)
}

function rotateVectorY(v, angle) {
    return createVector(v.x * Math.cos(angle) - v.z * Math.sin(angle), v.y, -v.x * Math.sin(angle) + v.z * Math.cos(angle))
}

function rotateVectorX(v, angle) {
    return createVector(v.x, v.y * Math.cos(angle) - v.z * Math.sin(angle), v.y * Math.sin(angle) + v.z * Math.cos(angle))
}