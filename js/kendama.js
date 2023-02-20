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
        this.y = 0;
        this.s = 60;
        this.v = v;
        this.m = 0.15;
    }
    update() {
        if (dist(this.pos.x, this.pos.y, mousePos.x, mousePos.y) > 200) {
            this.v = mousePos.copy().sub(this.pos).normalize().mult((dist(this.pos.x, this.pos.y, mousePos.x, mousePos.y) - 200))
        }
        this.v.add(createVector(0, 9.81))
        this.v.mult(0.9)
        this.pos.add(this.v)
    }
}