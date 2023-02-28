var w = window.innerWidth;
var h = window.innerHeight;
var minRez = 2 ** 6
var rez = minRez
var rezoffsetx = 0
var rezoffsety = 0
var cam
var scene
var lights
var distMax = 5000
var maxStep = 5000
var touchDist = 0.05
var bounceLimit = 7
var alreadyCalculted = false
var canvas = document.getElementById("canvas")
canvas.width = w;
canvas.height = h
var ctx = canvas.getContext('2d');
var pixelsAlreadyColored = []

var imgData = ctx.createImageData(canvas.width, canvas.height)


function setup() {
    createCanvas(0, 0)
    var randomBubbleScene = []
    for (let i = 0; i < 20; i++) {
        var x = Math.random() * 120 - 60
        var y = Math.random() * 60 - 20
        var z = Math.random() * 60 + 10
        var bouncness = Math.random()
        randomBubbleScene.push(new Sphere(createVector(x, y, z), Math.random() * 10 + 5, randomColor(), bouncness > 0.1 ? bouncness : 0))
    }
    //randomBubbleScene.push(new Cube(Math.random() * 60 - 30, Math.random() * 60 - 30, Math.random() * 60 - 30, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40, randomColor(), true))
    randomBubbleScene.push(new Plane(0, [198, 135, 103], 0.6))

    var mirrorScene = [
        new Cube(0, 10, 40, 20, 2, 20, randomColor(), true),
        new Cube(21, 30, 40, 2, 20, 20, randomColor(), true),
        new Cube(0, 30, 60, 20, 20, 2, randomColor(), true),
        new Sphere(0, 30, 40, 10, randomColor())
    ]

    var humhumSceen = [
        //heart
        new Sphere(0, 0, 100, 15, [255, 10, 10]),
        new Sphere(-5, 5, 100, 15, [255, 10, 10]),
        new Sphere(5, 5, 100, 15, [255, 10, 10]),
        new Sphere(-10, 10, 100, 15, [255, 10, 10]),
        new Sphere(10, 10, 100, 15, [255, 10, 10]),
        new Sphere(-15, 15, 100, 15, [255, 10, 10]),
        new Sphere(15, 15, 100, 15, [255, 10, 10]),
        new Sphere(-20, 20, 100, 15, [255, 10, 10]),
        new Sphere(20, 20, 100, 15, [255, 10, 10]),
        new Sphere(-15, 30, 100, 15, [255, 10, 10]),
        new Sphere(15, 30, 100, 15, [255, 10, 10]),
        new Sphere(-10, 25, 100, 15, [255, 10, 10]),
        new Sphere(10, 25, 100, 15, [255, 10, 10]),
        new Sphere(0, 15, 100, 15, [255, 10, 10]),
        //coca...
        new Sphere(0, 20, 120, 10, [255, 30, 50]),
        new Sphere(0, 15, 125, 10, [255, 30, 50]),
        new Sphere(0, 10, 130, 10, [255, 30, 50]),
        new Sphere(0, 5, 135, 10, [255, 30, 50]),
        new Sphere(0, 0, 140, 10, [255, 30, 50]),
        new Sphere(0, -5, 145, 10, [255, 30, 50]),
        new Sphere(15, -10, 150, 10, [255, 30, 50]),
        new Sphere(-15, -10, 150, 10, [255, 30, 50]),
        // //bubble
        new Sphere(0, 32, 115, 3, [255, 255, 255]),
        new Sphere(0, 35, 113, 3, [255, 255, 255])
    ]

    var newScene = [
        new MandleBulb(),
        //new SmoothTwoSpheres(-10, 10, 20, 12, 10, 20, 10, 10, randomColor(), randomColor(), 20, true),

        //new SmoothTwoSpheres(-5, 50, 20, 12, 50, 30, 10, 10, randomColor(), randomColor(), 20, true)
    ]
    cam = new Camera()
    scene = randomBubbleScene
    lights = [new Light(createVector(500, 500, 0), 1500, createVector(251, 251, 251))]
    frameRate(100)
}
var offset = [0, 0]

var isSquareRoot = function(n) { return n > 0 && Math.sqrt(n) % 1 === 0; };

var count = 0
var prevItt = 0
var s = rez
var alt = true

function draw() {
    if (count < rez ** 2) {
        document.getElementById("pourcent").innerHTML = `${Math.floor(count*100/rez**2)}%`
        for (let x = offset[0]; x < w; x += rez) {
            for (let y = offset[1]; y < h; y += rez) {
                var newDir = createVector(x - w / 2, h / 2 - y, 0);
                newDir = rotateVectorX(rotateVectorY(newDir, cam.ay), cam.ax)
                var color = castRay(cam.pos, newDir.add(cam.dir))
                ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 255)`;
                ctx.fillRect(x, y, s, s);
            }
        }
        offset[0] += alt ? s : s * 2
        if (offset[0] >= rez) {
            offset[0] = alt ? s : 0
            offset[1] += s
            alt = !alt
        }
        if (offset[1] >= rez) {
            s /= 2
            offset[0] = s
            offset[1] = 0
        }
        count++
    } else {
        document.getElementById("pourcent").innerHTML = ``
    }
}
const myImg = new Image();
myImg.crossOrigin = "Anonymous";
var img
myImg.onload = () => {
    img = document.createElement('canvas').getContext('2d');
    img.canvas.width = myImg.width
    img.canvas.height = myImg.height
    img.drawImage(myImg, 0, 0);
}
myImg.src = './img/skybox3.jpg';

function skyLight(dir) {
    dir.normalize()
    var u = 0.5 + Math.atan2(dir.z, dir.x) / (2 * Math.PI)
    var v = 0.5 + Math.asin(-dir.y) / Math.PI
    color = img.getImageData(Math.floor(u * myImg.width), Math.floor(v * myImg.height), 1, 1).data
    return [color[0], color[1], color[2]]
}
var lastPixColor

//cast the ray (call for every pixels) return a rgb color
function castRay(origin, dir, bounceNb = 0) {
    var rayResult = rayMarch(origin, dir)
        //return a color
    if (rayResult.objTouch) {
        return getLight(rayResult, dir, bounceNb)
    } else {
        return skyLight(dir)
    }
}

//ray march and return the distance walked and if touch obj return it and it's touched point
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
        //if (point.x > -20 && point.x < 50) {
    for (let obj of scene) {
        var dist = obj.getDist(point)
        if (dist < minDist) {
            minDist = dist
            if (dist <= touchDist) {
                objTouch = obj
            }
        }
    }
    //}
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

function inShadow(rayResult, light, lightDir) {
    var rayToLight = rayMarch(rayResult.point.add(lightDir * 1.1), lightDir)
    return rayToLight.dist < distancePoints(rayResult.point, light.pos) && rayToLight.objTouch != rayResult.objTouch
}

//return the color affected by the lights environement
function getLight(rayResult, dir, bounceNb) {
    var finalColor = [0, 0, 0]

    var normal = getNormal(rayResult.point).normalize()
    lights.forEach(light => {
        var lightDir = light.pos.copy().sub(rayResult.point).normalize()
        var diff = normal.dot(lightDir)
        var lightColor = light.getColor(rayResult.point)
        var lightStrenght = light.strenght(rayResult.point)
        finalColor = mixColor(finalColor, lightColor, 1 - (diff * (1 - lightStrenght)))
        finalColor = mixColor(finalColor, rayResult.objTouch.getColor(rayResult.point), lightStrenght)
            //si un objet est placé entre l'objet et la lumiere => true (ombre porté)
        if (inShadow(rayResult, light, lightDir)) {
            finalColor = mixColor(finalColor, [0, 0, 0])
        }
    });
    if (bounceNb > 0) console.log(rayResult.objTouch)
        //reflect
    bounceNb++
    var colorBounce
    if (rayResult.objTouch.bounce > 0 && bounceNb <= bounceLimit) {
        var reflect = reflectedVector(normal, dir)
        colorBounce = castRay(rayResult.point.add(reflect.mult(touchDist * 1.1)), reflect, bounceNb)
    }
    //var objReflected = rayMarch(rayResult.point.add(reflect), reflect).objTouch
    if (colorBounce) {
        finalColor = mixColor(finalColor, colorBounce, 1 - rayResult.objTouch.bounce)
    }

    return finalColor
}

function reflectedVector(normal, dir) {
    return dir.sub(normal.mult(dir.dot(normal)).mult(2)).normalize()
}

function mixColor(c1, c2, t = 0.5) {
    return [(c1[0] * t + (1 - t) * c2[0]), (c1[1] * t + (1 - t) * c2[1]), (c1[2] * t + (1 - t) * c2[2])]
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
        resetRendering()
    }
    if (e.keyCode == 39) { //fleche droite
        cam.pos.add(rotateVectorY(cam.dir, 90).setMag(cam.speed))
        resetRendering()
    }
    if (e.keyCode == 40) { //fleche bas
        cam.pos.sub(cam.dir.copy().setMag(cam.speed))
        resetRendering()
    }
    if (e.keyCode == 38) { //fleche haut
        cam.pos.add(cam.dir.copy().setMag(cam.speed));
        resetRendering()
    }
    if (e.keyCode == 16) { //shift key
        cam.pos.y += cam.speed;
        resetRendering()
    }
    if (e.keyCode == 90) { //z key
        cam.ay += 2
        cam.dir = rotateVectorY(cam.dir, 2)
        resetRendering()
    }
    if (e.keyCode == 65) { //a key
        cam.ay -= 2
        cam.dir = rotateVectorY(cam.dir, -2)
        resetRendering()
    }
    if (e.keyCode == 81) { //q key
        cam.az += 2
        cam.dir = rotateVectorX(cam.dir, 2)
        resetRendering()
    }
    if (e.keyCode == 83) { //s key
        cam.az -= 2
        cam.dir = rotateVectorX(cam.dir, -2)
        resetRendering()
    }
})

function resetRendering() {
    offset = [0, 0]
    count = 0
    s = rez
    alt = true
}

function randomColor() {
    return [parseInt(Math.random() * 250), parseInt(Math.random() * 250), parseInt(Math.random() * 250)]
}
window.addEventListener("mousedown", (e) => {
    var newDir = createVector(e.clientX - w / 2, h / 2 - e.clientY, 0);
    newDir = rotateVectorX(rotateVectorY(newDir, cam.ay), cam.ax)
    var res = rayMarch(cam.pos, newDir.add(cam.dir))
    if (res.objTouch) {
        if (res.objTouch.bounce > 0) res.objTouch.bounce = 0
        else res.objTouch.bounce = 1
        resetRendering()
    }
})