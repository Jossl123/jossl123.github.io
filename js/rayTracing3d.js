var w = window.innerWidth;
var h = window.innerHeight;
var minRez = 40
var rez = minRez
var rezoffsetx = 0
var rezoffsety = 0
var cam
var scene
var light
var distMax = 5000
var maxStep = 5000
var touchDist = 0.05
var bounceLimit = 7
var alreadyCalculted = false
var skyLight = [135, 231, 235]
var canvas = document.getElementById("canvas")
canvas.width = w;
canvas.height = h
var ctx = canvas.getContext('2d');
var pixelsAlreadyColored = []

var imgData = ctx.createImageData(canvas.width, canvas.height)


function setup() {
    createCanvas(0, 0)
    var randomBubbleScene = []
    for (let i = 0; i < 30; i++) {
        randomBubbleScene.push(new Sphere(Math.random() * 60 - 30, Math.random() * 60 - 30, Math.random() * 60 - 30, Math.random() * 10, randomColor(), Math.random() < 0.7))
    }
    randomBubbleScene.push(new Cube(Math.random() * 60 - 30, Math.random() * 60 - 30, Math.random() * 60 - 30, Math.random() * 80 - 40, Math.random() * 80 - 40, Math.random() * 80 - 40, randomColor(), true))
    randomBubbleScene.push(new Plane(0, [198, 135, 103], true))

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
        //new MandleBulb(),
        new SmoothTwoSpheres(-10, 10, 20, 12, 10, 20, 10, 10, randomColor(), randomColor(), 20, true),
        new SmoothTwoSpheres(-5, 50, 20, 12, 50, 30, 10, 10, randomColor(), randomColor(), 20, true)
    ]

    cam = new Camera()
    scene = randomBubbleScene
    light = new Light()
}
var offset = [0, 0]

function draw() {
    if (offset[1] < rez) {
        document.getElementById("pourcent").innerHTML = `${Math.floor((offset[0]+offset[1]*rez)*100/rez**2)}%`
        for (let x = offset[0]; x < w; x += rez) {
            for (let y = offset[1]; y < h; y += rez) {
                var newDir = createVector(x - w / 2, h / 2 - y, 0);
                newDir = rotateVectorX(rotateVectorY(newDir, cam.ay), cam.ax)
                var color = castRay(cam.pos, newDir.add(cam.dir))
                var index = (x + y * w) * 4
                    // imgData.data[index] = color[0]
                    // imgData.data[index + 1] = color[1]
                    // imgData.data[index + 2] = color[2]
                    // imgData.data[index + 3] = 255
                ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 255)`;
                if (!offset[0] && !offset[1]) ctx.fillRect(x, y, rez - offset[0], rez - offset[1]);
                else ctx.fillRect(x, y, 1, rez - offset[1]);
            }
        }
        offset[0] += 1
        if (offset[0] >= rez) {
            offset[0] = 0
            offset[1] += 1
        }
    } else {
        document.getElementById("pourcent").innerHTML = ``
            //ctx.putImageData(imgData, 0, 0);
    }
}

// function draw() {
//     if (rez >= 1) {
//         for (let x = 0; x < w; x += rez) {
//             for (let y = 0; y < h; y += rez) {
//                 //calculate if the pixel have already been colored
//                 for (let i = 0; i < minRez - rez; i++) {
//                     if ((x + y * w) / (minRez - i) == minRez - i) {
//                         alreadyCalculted = true;
//                         break;
//                     } else {
//                         alreadyCalculted = false;
//                     }
//                 }
//                 if (!alreadyCalculted) {
//                     var newDir = createVector(x - w / 2, h / 2 - y, 0);
//                     newDir = rotateVectorX(rotateVectorY(newDir, cam.ay), cam.ax)
//                     newDir = cam.dir.copy().add(newDir)
//                     var color = castRay(cam.pos, newDir, 0)
//                     if (rez == minRez) {
//                         for (let i = 0; i < rez; i++) {
//                             for (let j = 0; j < rez; j++) {
//                                 if (x + i < w && y + j < h) {
//                                     var index = ((x + i) + (y + j) * w) * 4
//                                     imgData.data[index] = color[0]
//                                     imgData.data[index + 1] = color[1]
//                                     imgData.data[index + 2] = color[2]
//                                     imgData.data[index + 3] = 255;
//                                 }
//                             }
//                         }
//                     } else {
//                         var index = (x + y * w) * 4
//                         imgData.data[index] = color[0]
//                         imgData.data[index + 1] = color[1]
//                         imgData.data[index + 2] = color[2]
//                         imgData.data[index + 3] = 255;
//                     }
//                 }

//                 //calculate if the pixel have already been colored
//                 // for (let i = 0; i < minRez - rez; i++) {
//                 //     if ((x + y * w) % (minRez - i) == 0) {
//                 //         alreadyCalculted = true;
//                 //         break;
//                 //     } else {
//                 //         alreadyCalculted = false;
//                 //     }
//                 // }
//                 // if (!alreadyCalculted) {
//                 //     var newDir = createVector((x + rezoffsetx) - w / 2, h / 2 - (y + rezoffsety), 0);
//                 //     newDir = rotateVectorX(rotateVectorY(newDir, cam.ay), cam.ax)
//                 //     newDir = cam.dir.copy().add(newDir)
//                 //     var color = castRay(cam.pos, newDir, 0)
//                 //     var index = ((x + rezoffsetx) + (y + rezoffsety) * w) * 4
//                 //     if (x + rezoffsetx < w && y + rezoffsety < h) {
//                 //         imgData.data[index] = color[0]
//                 //         imgData.data[index + 1] = color[1]
//                 //         imgData.data[index + 2] = color[2]
//                 //         imgData.data[index + 3] = 255;
//                 //     }
//                 // }
//             }
//         }
//         // if (rezoffsety + 1 >= minRez) {
//         //     rezoffsety = -1;
//         //     rezoffsetx++;
//         // }
//         // rezoffsety++;
//         rez -= 1
//         ctx.putImageData(imgData, 0, 0);
//     }
//     // light.pos.x = sin(frameCount / 10) * 100
//     // light.pos.z = cos(frameCount / 10) * 100 + 50
// }
var lastPixColor = skyLight

// function draw() {
//     if (rez >= 1) {
//         document.getElementById("pourcent").innerHTML = `index / 4 / h * w * w * 100%`
//         for (let x = 0; x < w; x++) {
//             for (let y = 0; y < h; y++) {
//                 var index = (x + y * w) * 4
//                 if (true) { //if pixel have not been calculed
//                     var newDir = createVector(x - w / 2, h / 2 - y, 0);
//                     newDir = rotateVectorX(rotateVectorY(newDir, cam.ay), cam.ax)
//                     newDir = cam.dir.copy().add(newDir)
//                     var color = castRay(cam.pos, newDir, 0)
//                     lastPixColor = color;
//                 }
//                 imgData.data[index] = lastPixColor[0]
//                 imgData.data[index + 1] = lastPixColor[1]
//                 imgData.data[index + 2] = lastPixColor[2]
//                 imgData.data[index + 3] = 255;
//             }
//         }
//         rez -= 1
//         ctx.putImageData(imgData, 0, 0);
//     }
// }

//cast the ray (call for every pixels) return a rgb color
function castRay(origin, dir, bounceNb = 0) {
    var rayResult = rayMarch(origin, dir)
        //return a color
    if (rayResult.objTouch) {
        return getLight(rayResult, dir, bounceNb)
    } else {
        return skyLight
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

//return the color affected by the light environement
function getLight(rayResult, dir, bounceNb) {
    var normal = getNormal(rayResult.point).normalize()
    var lightDir = light.pos.copy().sub(rayResult.point).normalize()
    var diff = normal.dot(lightDir)
    var reflect = reflectedVector(normal, dir)
    bounceNb++
    var colorBounce
    if (bounceNb <= bounceLimit && rayResult.objTouch.bounce) {
        colorBounce = castRay(rayResult.point.add(reflect), reflect, bounceNb)
    }
    //var objReflected = rayMarch(rayResult.point.add(reflect), reflect).objTouch
    var rayToLight = rayMarch(rayResult.point.add(lightDir), lightDir)
    var finalColor = rayResult.objTouch.color
    if (colorBounce) {
        finalColor = mixColor(finalColor, colorBounce)
    }
    //si un objet est placé entre l'objet et la lumiere => true (ombre porté)
    if (rayToLight.dist < distancePoints(rayResult.point, light.pos) && rayToLight.objTouch != rayResult.objTouch) {
        finalColor = mixColor(finalColor, [0, 0, 0])
    }
    finalColor = mixColor(finalColor, light.color)

    return mixColor(finalColor, [diff * 255, diff * 255, diff * 255])
}

function reflectedVector(normal, dir) {
    return dir.sub(normal.mult(dir.dot(normal)).mult(2)).normalize()
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
        offset = [0, 0]
    }
    if (e.keyCode == 39) { //fleche droite
        cam.pos.add(rotateVectorY(cam.dir, 90).setMag(cam.speed))
        offset = [0, 0]
    }
    if (e.keyCode == 40) { //fleche bas
        cam.pos.sub(cam.dir.copy().setMag(cam.speed))
        offset = [0, 0]
    }
    if (e.keyCode == 38) { //fleche haut
        cam.pos.add(cam.dir.copy().setMag(cam.speed));
        offset = [0, 0]
    }
    if (e.keyCode == 16) { //shift key
        cam.pos.y += cam.speed;
        offset = [0, 0]
    }
    if (e.keyCode == 90) { //z key
        cam.ay += 2
        cam.dir = rotateVectorY(cam.dir, 2)
        offset = [0, 0]
    }
    if (e.keyCode == 65) { //a key
        cam.ay -= 2
        cam.dir = rotateVectorY(cam.dir, -2)
        offset = [0, 0]
    }
    if (e.keyCode == 81) { //q key
        cam.ax += 2
        cam.dir = rotateVectorX(cam.dir, 2)
        offset = [0, 0]
    }
    if (e.keyCode == 83) { //s key
        cam.ax -= 2
        cam.dir = rotateVectorX(cam.dir, -2)
        offset = [0, 0]
    }
})

function randomColor() {
    return [parseInt(Math.random(250)), parseInt(Math.random(250)), 100]
}