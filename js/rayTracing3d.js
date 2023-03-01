var w = window.innerWidth;
var h = window.innerHeight;
var minRez = 2 ** 5
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
var canvas = document.getElementById("rendering")
canvas.width = w;
canvas.height = h
var ctx = canvas.getContext('2d');
var canvasUI = document.getElementById("UI")
canvasUI.width = w;
canvasUI.height = h
var ui = canvasUI.getContext('2d');
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
    //randomBubbleScene.push(new Plane(0, [198, 135, 103], 0.6))

    var mirrorScene = [
        new Cube(createVector(0, 10, 40), 20, 2, 20, randomColor(), 1),
        new Cube(createVector(21, 30, 40), 2, 20, 20, randomColor(), 1),
        new Cube(createVector(0, 30, 60), 20, 20, 2, randomColor(), 1),
        new Sphere(createVector(0, 30, 40), 10, randomColor(), 0.2)
    ]

    var humhumSceen = [

        //heart
        new Sphere(createVector(0, 0, 100), 15, [255, 10, 10]),
        new Sphere(createVector(-5, 5, 100), 15, [255, 10, 10]),
        new Sphere(createVector(5, 5, 100), 15, [255, 10, 10]),
        new Sphere(createVector(-10, 10, 100), 15, [255, 10, 10]),
        new Sphere(createVector(10, 10, 100), 15, [255, 10, 10]),
        new Sphere(createVector(-15, 15, 100), 15, [255, 10, 10]),
        new Sphere(createVector(15, 15, 100), 15, [255, 10, 10]),
        new Sphere(createVector(-20, 20, 100), 15, [255, 10, 10]),
        new Sphere(createVector(20, 20, 100), 15, [255, 10, 10]),
        new Sphere(createVector(-15, 30, 100), 15, [255, 10, 10]),
        new Sphere(createVector(15, 30, 100), 15, [255, 10, 10]),
        new Sphere(createVector(-10, 25, 100), 15, [255, 10, 10]),
        new Sphere(createVector(10, 25, 100), 15, [255, 10, 10]),
        new Sphere(createVector(0, 15, 100), 15, [255, 10, 10]),

        //cocka...
        new Sphere(createVector(0, 20, 120), 10, [255, 30, 50], 1),
        new Sphere(createVector(0, 15, 125), 10, [255, 30, 50], 1),
        new Sphere(createVector(0, 10, 130), 10, [255, 30, 50], 1),
        new Sphere(createVector(0, 5, 135), 10, [255, 30, 50], 1),
        new Sphere(createVector(0, 0, 140), 10, [255, 30, 50], 1),
        new Sphere(createVector(0, -5, 145), 10, [255, 30, 50], 1),
        new Sphere(createVector(15, -10, 150), 10, [255, 30, 50], 1),
        new Sphere(createVector(-15, -10, 150), 10, [255, 30, 50], 1),

        // 
        //bubble
        new Sphere(0, 32, 115, 3, [255, 255, 255]),
        new Sphere(0, 35, 113, 3, [255, 255, 255])
    ]

    var newScene = [
        //new MandleBulb(),

        new SmoothTwoSpheres(-10, 10, 20, 12, 10, 20, 10, 10, randomColor(), randomColor(), 20, true),


        new SmoothTwoSpheres(-5, 50, 20, 12, 50, 30, 10, 10, randomColor(), randomColor(), 20, true)
    ]
    cam = new Camera()
    scene = mirrorScene
    lights = [new Light(createVector(500, 500, 0), 1500, createVector(251, 251, 251))]
    frameRate(100)
        //fullRender()
}

function fullRender() {
    var imgData = ctx.createImageData(w, h);
    for (let x = 0; x < w; x += 1) {
        for (let y = 0; y < h; y += 1) {
            var color = castRay(cam.pos, pixelCoordToDir(x, y))
            var index = (x + y * w) * 4
            imgData.data[index] = color[0]
            imgData.data[index + 1] = color[1]
            imgData.data[index + 2] = color[2]
            imgData.data[index + 3] = 255
        }
    }
    document.getElementById("pourcent").innerHTML = ``
    ctx.putImageData(imgData, 0, 0);
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
                var color = castRay(cam.pos, pixelCoordToDir(x, y))
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
myImg.src = './img/skyboxTown.jpg';

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

function rotateVectorZ(v, a) {
    a = a * Math.PI / 180
    var x = v.x * Math.cos(a) - v.y * Math.sin(a)
    var y = v.x * Math.sin(a) + v.y * Math.cos(a)
    return createVector(x, y, v.z)
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
    if (e.keyCode == 37) {
        //fleche gauche
        if (objMoving) objMoving.pos.x -= 1
        else cam.pos.add(rotateVectorY(cam.dir, -90).setMag(cam.speed))
        resetRendering()
    }
    if (e.keyCode == 39) {
        //fleche droite
        if (objMoving) objMoving.pos.x += 1
        else cam.pos.add(rotateVectorY(cam.dir, 90).setMag(cam.speed))
        resetRendering()
    }
    if (e.keyCode == 40) {
        //fleche bas
        if (objMoving) objMoving.pos.y -= 1
        else cam.pos.sub(cam.dir.copy().setMag(cam.speed))
        resetRendering()
    }
    if (e.keyCode == 38) {
        //fleche haut
        if (objMoving) objMoving.pos.y += 1
        else cam.pos.add(cam.dir.copy().setMag(cam.speed));
        resetRendering()
    }
    if (e.keyCode == 16) {
        //shift key
        cam.pos.y += cam.speed;
        resetRendering()
    }
    if (e.keyCode == 90) {
        //z key
        cam.rot.y += 2
        cam.dir = rotateVectorY(cam.dir, 2)
        resetRendering()
    }
    if (e.keyCode == 65) {
        //a key
        cam.rot.y -= 2
        cam.dir = rotateVectorY(cam.dir, -2)
        resetRendering()
    }
    if (e.keyCode == 81) {
        //q key
        cam.rot.z += 2
        cam.dir = rotateVectorX(cam.dir, 2)
        resetRendering()
    }
    if (e.keyCode == 83) {
        //s key
        cam.rot.z -= 2
        cam.dir = rotateVectorX(cam.dir, -2)
        resetRendering()
    }
})

function resetRendering() {
    offset = [0, 0]
    count = 0
    s = rez
    alt = true
    resetUi()
}

function resetUi() {
    if (objMoving) {
        clearCanva(ui)
        var pixel = worldCoordToPixelCoord(objMoving.pos)
        ui.beginPath();
        canvas_arrow(ui, pixel.x, pixel.y, pixel.x + 50, pixel.y);
        canvas_arrow(ui, pixel.x, pixel.y, pixel.x, pixel.y + 50);
        canvas_arrow(ui, pixel.x, pixel.y, pixel.x + 50, pixel.y + 50);
        ui.stroke();
    }
}

function randomColor() {
    return [parseInt(Math.random() * 250), parseInt(Math.random() * 250), parseInt(Math.random() * 250)]
}

function toCamCoord(point) {
    var res = point.copy()
    res.sub(cam.pos)
    res = rotateVectorX(res, cam.rot.x)
    res = rotateVectorY(res, cam.rot.y)
    res = rotateVectorZ(res, cam.rot.z)
    return res
}

function worldCoordToPixelCoord(point) {
    point = toCamCoord(point).setMag(cam.distFromScreen)
    var x = point.x + w / 2
    var y = -point.y + h / 2
    return createVector(x, y, 0)
}

function pixelCoordToDir(x, y) {
    var newDir = createVector(x - w / 2, h / 2 - y, 0);
    newDir = rotateVectorX(rotateVectorY(newDir, cam.rot.y), cam.rot.x)
    return newDir.add(cam.dir.copy().mult(cam.distFromScreen))
}

function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function clearCanva(context) {
    context.clearRect(0, 0, w, h)
}

window.addEventListener("wheel", (e) => {
    cam.distFromScreen = Math.max(0.5, cam.distFromScreen - Math.sign(e.deltaY) * 30)
    resetRendering()
})

var moving = false
var rotating = false
var movingStart = [0, 0]
var objMoving = undefined
window.addEventListener("mousedown", (e) => {
    if (e.which == 2) {
        moving = true
        movingStart = [e.clientX, e.clientY]
        document.body.style.cursor = "grab"
    } else if (e.which == 1) {
        clearCanva(ui)
        var res = rayMarch(cam.pos, pixelCoordToDir(e.clientX, e.clientY))
        if (res.objTouch) {
            objMoving = res.objTouch
            var pixel = worldCoordToPixelCoord(res.objTouch.pos)
            ui.beginPath();
            canvas_arrow(ui, pixel.x, pixel.y, pixel.x + 50, pixel.y);
            canvas_arrow(ui, pixel.x, pixel.y, pixel.x, pixel.y + 50);
            canvas_arrow(ui, pixel.x, pixel.y, pixel.x + 50, pixel.y + 50);
            ui.stroke();
        } else objMoving = undefined
    } else if (e.which == 3) {
        rotating = true
        movingStart = [e.clientX, e.clientY]
        document.body.style.cursor = "grab"
    }
    e.preventDefault()
})
window.addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("mousemove", (e) => {
    if (moving) {
        var difx = movingStart[0] - e.clientX
        var dify = movingStart[1] - e.clientY
        cam.pos.add(createVector(difx, -dify))
        resetRendering()
        movingStart = [e.clientX, e.clientY]
    } else if (rotating) {
        var difx = movingStart[0] - e.clientX
        var dify = movingStart[1] - e.clientY
        cam.rot.add(createVector(dify, difx))
        cam.dir = rotateVectorY(cam.dir, difx)
        cam.dir = rotateVectorX(cam.dir, dify)
        resetRendering()
        movingStart = [e.clientX, e.clientY]
    }
    e.preventDefault()
})
window.addEventListener("mouseup", (e) => {
    if (e.which == 2) {
        moving = false
        document.body.style.cursor = ""
    } else if (e.which == 3) {
        rotating = false
        document.body.style.cursor = ""
    }
    e.preventDefault()
})