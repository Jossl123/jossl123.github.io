var ball
var mousePos

function setup() {
    createCanvas(windowWidth, windowHeight)
    ball = new Ball(createVector(50, 50), createVector(0, 0))
    fill(55)
    mousePos = createVector(50, 50)
}

function draw() {
    clear()
    ball.update()
    circle(ball.pos.x, ball.pos.y, ball.s)
}
document.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX
    mousePos.y = e.clientY
})
class Ball {
    constructor(pos, v) {
        this.pos = pos;
        this.gravity = createVector(0, 50)
        this.stringLength = 400
        this.s = 60;
        this.v = v;
    }
    update() {
        if (dist(this.pos.x, this.pos.y, mousePos.x, mousePos.y) > this.stringLength) {
            this.v.add(mousePos.copy().sub(this.pos).normalize().mult(min((dist(this.pos.x, this.pos.y, mousePos.x, mousePos.y) - this.stringLength), this.stringLength)))
        }
        console.log(this.v)
        this.v.mult(0.95)
        this.pos.add(this.v)
        this.pos.add(this.gravity)
    }
}