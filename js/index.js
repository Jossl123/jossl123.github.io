

window.onload = function() {
    let retNb = Math.min(Object.entries(data).length, 15)
    Object.entries(data).forEach(retex => {
        if (retNb <= 0)return
        var button = `<button id="${retex[0]}" onclick="showRetex(event)" class="retexBut" style="background: url('./img/pp/${retex[0]}.png');"></button>`
        document.getElementById("retexs").innerHTML += button
        retNb--;
    })
    window.scrollTo(0, 0)
    document.getElementsByTagName("main")[0].style.marginBottom = window.innerHeight - document.getElementById("firstView").offsetHeight + "px"
}
var beginingx

function element_drag_ghost(event) {
    event.dataTransfer.setDragImage(document.createElement('img'), 0, 0)
}
function hideRetex() {
    document.getElementById("visibleRetex").parentNode.removeChild(document.getElementById("visibleRetex"))
    start3d()
}

function drop(event) {
    var dm = document.getElementById("retexs")
    if (event.clientX != 0) {
        var difx = -beginingx + event.clientX
        const matrix = new DOMMatrixReadOnly(document.getElementById('retexs').style.transform)
        const translateX = matrix.m41;
        let translation = Math.min(0, Math.max(translateX + difx, -dm.offsetWidth + window.innerWidth))
        dm.style.transform = `translateX(${translation}px)`
        if (translateX + difx <= -dm.offsetWidth + window.innerWidth + 10) document.getElementById("swipe").style.visibility = "hidden"
        else document.getElementById("swipe").style.visibility = "visible"
    }
    beginingx = event.clientX
    event.preventDefault()
    return false
}
document.addEventListener("mousemove", (event) => {
    beginingx = event.clientX
})
document.addEventListener("touchmove", (event) => {
    var dm = document.getElementById("retexs")
    if (event.clientX != 0) {
        var difx = -beginingx + event.changedTouches[0].clientX
        const matrix = new DOMMatrixReadOnly(document.getElementById('retexs').style.transform)
        const translateX = matrix.m41;
        dm.style.transform = `translateX(${Math.min(0, Math.max(translateX+difx, -dm.offsetWidth + window.innerWidth))}px)`

    }
    beginingx = event.changedTouches[0].clientX
})

function drag_over(event) {
    event.preventDefault()
    return false
}


//3d sphere
function start3d(){
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setSize(500, 400);
    while (document.getElementById("canvas_container").firstChild) {
        document.getElementById("canvas_container").removeChild(document.getElementById("canvas_container").firstChild);
    }

    document.getElementById("canvas_container").appendChild(renderer.domElement);
    var geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    var material = new THREE.MeshNormalMaterial();
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);


    scene.fog = new THREE.Fog(0x2f3640, 5, 50);
    camera.position.z = 10;
    var t = 0
    var render = function() {
        requestAnimationFrame(render);
        sphere.rotation.y += 0.01;
        sphere.rotation.z += 0.012;
        sphere.rotation.x += 0.008;
        renderer.render(scene, camera);
        console.log("testZ")
    };

    render();
}
start3d()



//back line
var maxCircleWidth = 10
var maxPointsNumber = 30
var lineColor = "#880000"
var canvas = document.getElementById('mouse_flow');
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var ctx = canvas.getContext('2d');
var points = []

function drawPoint(point, width) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, width, 0, Math.PI * 2);
    ctx.fill();
}

function randomOffsetedPoint(point) {
    return {
        x: point.x + Math.random() * 10 - 5,
        y: point.y + Math.random() * 10 - 5
    }
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
        ctx.fillStyle = lineColor;
        ctx.strokeStyle = lineColor;
        drawPoint(points[i], maxCircleWidth * (1 + i) / points.length)
        if (i > 0) {
            ctx.beginPath(); // Start a new path
            ctx.lineWidth = (maxCircleWidth * i / points.length) * 2;
            ctx.moveTo(points[i - 1].x, points[i - 1].y); // Move the pen to (30, 50)
            ctx.lineTo(points[i].x, points[i].y); // Draw a line to (150, 100)
            ctx.stroke();
        }
    }
}
setInterval(() => {
    if (points.length >= 2) points.shift()
    drawPoints()
}, 30)
ctx.scale(1, 1)
document.addEventListener("mousemove", (e) => {
    points.push({
        x: e.clientX,
        y: e.clientY
    })
    if (points.length > maxPointsNumber) points.shift()
    drawPoints()
})
window.onresize = function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
window.scrollTo(0, 0);



