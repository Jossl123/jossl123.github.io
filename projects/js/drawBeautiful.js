var diameter, center, dir, i
var pos = 0

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(0)
    diameter = windowHeight
    center = createVector(windowWidth / 2, windowHeight / 2)
    dir = createVector(diameter, 0)
    perimetre = 2 * Math.PI * diameter / 2
    i = perimetre / 10
}

function draw() {
    t = 0
    background(0)
    noFill()
    stroke(255)
    circle(center.x, center.y, diameter)
        // for (let k = 0; k < perimetre / i / 2; k++) {
        //     circle(center.x + Math.cos(pos) * diameter / 2, center.y + Math.sin(pos) * diameter / 2, i * 2)
        //     pos += perimetre / i
        // }
        // pos = 0
        //     //i = perimetre / t
        // t++
    for (let k = 0; k < 5; k++) {
        circle(center.x + Math.cos(pos) * diameter / 2, center.y + Math.sin(pos) * diameter / 2, diameter)
        pos += perimetre / i
    }
    pos = 0
}