var balls = []
function setup() {
    createCanvas(windowWidth, windowHeight)
    for (let x = 0; x < 1000; x++) {
        balls.push({pos: createVector(random(windowWidth), random(windowHeight) ), velo: createVector(0,0)})
    }
}
var offset = 0
var s = 200
function draw() {
    background(255, 10)
    fill(200,0,0)
    for (let i = 0; i < balls.length; i++) {
        noStroke()
        balls[i].pos.add(balls[i].velo)
        circle(balls[i].pos.x, balls[i].pos.y, 2)
        var rot = noise(balls[i].pos.x/s, balls[i].pos.y/s, offset)
        balls[i].velo = createVector(2,0).rotate((rot*2*PI))
        if (balls[i].pos.x < 0) balls[i].pos.x =windowWidth-1
        if (balls[i].pos.x > windowWidth) balls[i].pos.x = 0
        if (balls[i].pos.y < 0) balls[i].pos.x =windowHeight-1
        if (balls[i].pos.y > windowHeight) balls[i].pos.y = 0
    }
    offset+=0.01
    // fill(200,220,0)
    // stroke(126);
    // for (let x = 0; x < windowWidth; x+=10) {
    //     for (let y = 0; y < windowHeight; y+=10) {
    //         var rot = noise(x/100,y/100, offset)
    //         var v = createVector(5,0).rotate((rot*2*PI))
    //         line(x, y, x+v.x, y+v.y)
    //     }
    // }
}