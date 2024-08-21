let branches = []

function setup() {
    createCanvas(windowWidth, windowHeight);
    branches.push(new Branch(width / 2, height / 2, 500, Math.PI / 2))
}

function draw() {
    background(100)
    for (let branch of branches) {
        branch.draw()
    }
}

class Branch {
    constructor(x, y, length, startAngle, ) {
        this.growingState = 0
        this.x = x
        this.y = y
        this.length = length
        this.angles = [startAngle]
        this.branches = []
        this.leaves = []
    }
    draw() {
        stroke(0)
        fill(0)
        let x = this.x
        let y = this.y
        for (let i = 0; i < this.growingState; i++) {
            x += Math.cos(this.angles[i]) 
            y += Math.sin(this.angles[i]) 
            circle(x, y, (this.growingState-i)/30)
        }
        this.angles.push(this.angles[this.angles.length - 1] + random(-0.1,0.1))
        if (this.growingState<this.length) {
            this.growingState++
            if (random() < 0.01 && this.growingState < this.length) {
                this.branches.push(new Branch(x, y, (this.length-this.growingState)/2, this.angles[this.angles.length - 1] - (random(-0.3,0.3))))
            }
        }
        for (let branch of this.branches) {
            branch.draw()
        }

        if (random() < this.growingState / this.length / 30) {
            this.leaves.push(new Leaf(x, y))
        }
        for (let leaf of this.leaves) {
            leaf.draw()
        }
    }
}

class Leaf {
    constructor(x, y) {
        this.growingState = 0
        this.maxGrowingState = 100
        this.x = x
        this.y = y
    }
    draw() {
        fill(218,126,148)
        noStroke()
        
        //wind effect
        let x = this.x + random(-0.1,0.1)
        let y = this.y + random(-0.1,0.1)
        
        if (this.growingState < this.maxGrowingState) this.growingState++
        for (let i = 0; i < 5; i++) {
            let angle = Math.PI * 2 * i / 5
            let petalDirection = createVector(1, 0).rotate(angle)
            for (let leafSize = this.growingState; leafSize > 0; leafSize--) {
                let ratio = leafSize / this.growingState
                fill(218 + (255 - 218) * (1-ratio), 126 + (255 - 126) * (1-ratio), 148 + (255 - 148) * (1-ratio))
                let pos = petalDirection.copy().mult(leafSize / 10)
                circle(x + pos.x, y + pos.y, (5-this.growingState)/10)
            }
        }
    }
}