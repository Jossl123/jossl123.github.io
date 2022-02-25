var player = {
    pos: [0, 0]
}
var worldmap = ""
var h = 100
var w = 100
var s = 20;
var vh, vw
var inputDelay = 1
    //r, g, b, diggable?
var blockColor = [
    [100, 100, 250, 0],
    [10, 100, 0, 1]
]

function loadNewWorld() {
    for (let i = 0; i < h; i++) {
        for (let x = 0; x < w; x++) {
            if (i <= 10) worldmap += " "
            else worldmap += "!"
        }
    }
}
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function setup() {
    createCanvas(windowWidth, windowHeight)
    noStroke()
    loadNewWorld()
    player.pos = createVector(0, 0)
    vh = Math.floor(windowHeight / s) + 1;
    vw = Math.floor(windowWidth / s) + 1;
}

function draw() {
    drawWorld(player.pos.x, player.pos.y)
    if (frameCount % inputDelay == 0) keyDown()
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW)) player.pos.add([-1, 0])
    else if (keyIsDown(RIGHT_ARROW)) player.pos.add([1, 0])
    if (keyIsDown(UP_ARROW)) player.pos.add([0, -1])
    else if (keyIsDown(DOWN_ARROW)) player.pos.add([0, 1])
}

function fromMouseToWorldCoordinate(x, y) {
    console.log(Math.floor(x / s), Math.floor(y / s))
}

function mouseClicked(e) {
    fromMouseToWorldCoordinate(e.x, e.y)
}

function drawWorld(X, Y) {
    for (let y = 0; y < vh; y++) {
        for (let x = 0; x < vw; x++) {
            var ny = y + Y - Math.floor(vh / 2);
            var nx = x + X - Math.floor(vw / 2);
            i = ny * w + nx
            fill(255, 0, 0)
            if (i >= 0 && i < worldmap.length && ny >= 0 && nx >= 0 && ny < h && nx < w) {
                var k = worldmap[i].charCodeAt(0)
                if (k <= blockColor.length + 32) {
                    fill(blockColor[k - 32][0], blockColor[k - 32][1], blockColor[k - 32][2])
                } else fill(0, parseInt(worldmap[i].charCodeAt(0)), 0)
            }
            rect(x * s + 0, y * s + 0, s, s);
        }
    }
}