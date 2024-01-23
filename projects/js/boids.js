var birds = []
var birdsNb = 100
var perceptionRange = 70

let alignSlider, cohesionSlider, separationSlider

function setup() {
    createCanvas(windowWidth, windowHeight);
    alignSlider = createSlider(0, 5, 1.2, 0.1)
    cohesionSlider = createSlider(0, 5, 0.3, 0.1)
    separationSlider = createSlider(0, 5, 0.3, 0.1)
    for (let i = 0; i < birdsNb; i++) {
        birds.push(new Bird())
    }
}

function draw() {
    background(100)
    var prevBirds = Array.from(birds)
    for (let i = 0; i < birds.length; i++) {
        birds[i].update(prevBirds)
    }
}

class Bird {
    constructor(x = 0, y = 0) {
        this.position = createVector(random(width), random(height))
        this.velocity = p5.Vector.random2D()
        this.velocity.setMag(random(2, 3))
        this.acceleration = createVector()
        this.maxSpeed = 4;
        this.maxForce = 1
    }

    align(prevBirds) {
        var steeringAlign = createVector();
        var totalAlign = 0;
        var steeringCohesion = createVector();
        var totalCohesion = 0;
        var steeringSeparation = createVector();
        var totalSeparation = 0;
        for (let bird of prevBirds) {
            var distanceAlign = dist(this.position.x, this.position.y, bird.position.x, bird.position.y)
            if (distanceAlign <= perceptionRange && distanceAlign > 2 * perceptionRange / 3 && bird != this) {
                steeringAlign.add(bird.velocity)
                totalAlign++
            }
            var distanceCohesion = dist(this.position.x, this.position.y, bird.position.x, bird.position.y)
            if (distanceCohesion <= 2 * perceptionRange / 3 && distanceSeparation > perceptionRange && bird != this) {
                steeringCohesion.add(bird.position)
                totalCohesion++
            }
            var distanceSeparation = dist(this.position.x, this.position.y, bird.position.x, bird.position.y)
            if (distanceSeparation <= perceptionRange / 3 && bird != this) {
                var diff = p5.Vector.sub(this.position, bird.position)
                diff.div(distanceSeparation)
                steeringSeparation.add(diff)
                totalSeparation++
            }
        }
        if (totalAlign > 0) {
            steeringAlign.div(totalAlign)
            steeringAlign.sub(this.velocity)
            steeringAlign.setMag(this.maxSpeed)
            steeringAlign.limit(this.maxForce)
        }
        if (totalCohesion > 0) {
            steeringCohesion.div(totalCohesion)
            steeringCohesion.sub(this.position)
            steeringCohesion.setMag(this.maxSpeed)
            steeringCohesion.sub(this.velocity)
            steeringCohesion.limit(this.maxForce)
        }
        if (totalSeparation > 0) {
            steeringSeparation.div(totalSeparation)
            steeringSeparation.setMag(this.maxSpeed)
            steeringSeparation.sub(this.velocity)
            steeringSeparation.limit(this.maxForce)
        }
        steeringAlign.mult(alignSlider.value())
        this.acceleration.add(steeringAlign)
        steeringCohesion.mult(cohesionSlider.value())
        this.acceleration.add(steeringCohesion)
        steeringSeparation.mult(separationSlider.value())
        this.acceleration.add(steeringSeparation)
    }
    update(prevBirds) {
        this.align(prevBirds)
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.edges()
        this.show()
        this.acceleration = createVector()
    }

    show() {
        strokeWeight(16)
        stroke(230)
        point(this.position.x, this.position.y)
    }

    edges() {
        if (this.position.x < 0) {
            this.position.x = width
        }
        if (this.position.x > width) {
            this.position.x = 0
        }
        if (this.position.y < 0) {
            this.position.y = height
        }
        if (this.position.y > height) {
            this.position.y = 0
        }
    }
}