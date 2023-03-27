var ball, string
var mousePos

function setup() {
    createCanvas(windowWidth, windowHeight)
    ball = new Ball(createVector(50, 50), createVector(0, 0))
    string = new String()
    fill(55)
    mousePos = createVector(50, 50)
}

function draw() {
    clear()
    string.update()
    string.draw()
    //circle(ball.pos.x, ball.pos.y, ball.s)
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

class Point{
    constructor(pos){
        this.pos = pos
        this.next_pos = pos.copy()
        this.velocity = createVector(0,-1)
    }
    pre_update(){
        this.velocity.add(createVector(0, -1))
        this.next_pos.sub(this.velocity)
    }
    update(){
        this.pos = this.next_pos.copy()
    }
}

class String{
    constructor(){
        this.points = []
        for (let i = 0; i < 10; i++) {
            this.points.push(new Point(createVector(100, 100+i*10)))
        }
    }
    update(){
        for (let i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            if (i != 0){
                var prev_point = this.points[i-1]
                point.pre_update()
                point.next_pos = prev_point.pos.copy().add(point.pos.copy().sub(prev_point.pos).normalize().mult(10))
            }else{
                point.next_pos = mousePos
            }
        }
    }
    draw(){
        for (let i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            point.update()
        }
        for (let i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            if (i != 0){
                var prev_point = this.points[i-1]
                line(point.pos.x, point.pos.y, prev_point.pos.x, prev_point.pos.y)
            }
        }
    }
}