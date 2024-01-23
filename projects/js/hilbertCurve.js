var points = []
var etapes = 1
var pointsNb = Math.pow(4, etapes)
var squaresNb = Math.pow(4, etapes - 1)
var offset = 10;

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(255)
    if (squaresNb > 0) {
        for (let y = 0; y < Math.sqrt(squaresNb); y++) {
            for (let x = 0; x < Math.sqrt(squaresNb); x++) {

            }
        }
    }
    for (let i = 0; i < pointsNb; i++) {
        var w = windowWidth - offset / 2
        var h = windowHeight - offset / 2
        var x = i * w / Math.sqrt(squaresNb);
        var y = i * h / Math.sqrt(squaresNb);
        points.push(new Point(x + offset, y + offset, i))
    }
    for (let i = 0; i < points.length - 1; i++) {
        line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y)
    }
}

class Point {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.index = index
    }
}