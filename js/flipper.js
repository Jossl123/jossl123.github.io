var ball
var ratio
var machine

function setup() {
    createCanvas(windowWidth, windowHeight)
    machine = new Machine(windowHeight, windowWidth)
    ball = new Ball(createVector(20, 1.20), createVector(0, 0))
    fill(55)
}
var vy = 0
var dt = 10 ** -3

function draw() {
    Fy = -ball.m * 9.8 * Math.sin(6.8)
    console.log(ball.pos.y)
    if (ball.pos.y < ball.s) {
        //Fy += 6000 * (ball.s - ball.pos.y)
        Fy = -Fy
    }
    vy += Fy / ball.m * dt
    ball.pos.y += vy * dt
    clear()
    circle(ball.pos.x, windowHeight - (ball.pos.y * 100 * machine.ratioX), ball.s * 2 * 100)
}

class Ball {
    constructor(pos, v) {
        this.pos = pos;
        this.y = 0;
        this.s = 0.05;
        this.v = v;
        this.m = 0.15;
    }
    speed() {
        this.v.y += 9.8 * Math.sin(6.8) * this.m
        this.y += this.v.y
    }
}

class Machine {
    constructor(h, w) {
        this.L = 106.68;
        this.l = 50.8;
        this.theta = 6.8;
        this.a = 9.8 * Math.sin(this.theta);
        this.ratioX = h / this.L;
    }
}