var light
var cam

function createUserPlanet() {
    document.getElementById("userOption").style.visibility = "hidden"
    Planet(createVector(0, 0, 0), parseInt(document.getElementById("resolution").value), 2, 3, 0.6)
    update()
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    cam = new Camera()
    light = new Light()
        // Planet(createVector(0, 0, 8), 400, 2, 3, 0.5)
        // update()
}

function update() {
    background(130, 213, 213)
    render()
}

function draw() {
    keyDown()
}

function estimateRenderingTime() {
    var r = parseInt(document.getElementById("resolution").value)
    var start = new Date().getTime();
    for (i = 0; i < r; ++i) {
        var k = perlin.get(random(), random(), random())
        k = perlin.get(random(), random(), random())
    }
    var end = new Date().getTime();
    var time = end - start;
    alert('Calculate points position: ' + time * r / 100 + 's' + '\n' + 'triangles number : ' + (r - 1) ** 2 * 12);
}
