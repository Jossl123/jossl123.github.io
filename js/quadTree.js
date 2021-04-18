var points = []
var qtree;

function setup() {
    createCanvas(windowWidth, windowHeight);
    var boundaries = new Rectangle(0, 0, width, height)
    qtree = new Quadtree(boundaries, 4)
}

function draw() {
    background(255)
    for (let i = 0; i < points.length; i++) {
        points[i].render()
    }
    if (mouseIsPressed) {
        points.push(new Point(mouseX, mouseY, 4))
        qtree.insert(points[points.length - 1])
    }
    qtree.show()
}