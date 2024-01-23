class Quadtree {
    constructor(boundaries, capacity) {
        this.boundaries = boundaries
        this.points = []
        this.capacity = capacity
        this.subdivided = false
    }

    insert(point) {
        if (!this.contains(point)) {
            return
        }
        if (this.points.length < this.capacity) {
            this.points.push(point)
        } else {
            if (!this.subdivided) {
                this.subdivide()
            }
            if (this.northweast.contains(point)) {
                this.northweast.insert(point)
            } else if (this.northeast.contains(point)) {
                this.northeast.insert(point)
            } else if (this.southweast.contains(point)) {
                this.southweast.insert(point)
            } else if (this.southeast.contains(point)) {
                this.southeast.insert(point)
            }
        }
    }

    contains(point) {
        return (point.x >= this.boundaries.x && point.x <= this.boundaries.x + this.boundaries.w && point.y >= this.boundaries.y && point.y <= this.boundaries.y + this.boundaries.h)
    }

    subdivide() {
        var x = this.boundaries.x;
        var y = this.boundaries.y;
        var w = this.boundaries.w;
        var h = this.boundaries.h;

        var nw = new Rectangle(x, y, w / 2, h / 2)
        this.northweast = new Quadtree(nw, this.capacity)
        var ne = new Rectangle(x + w / 2, y, w / 2, h / 2)
        this.northeast = new Quadtree(ne, this.capacity)
        var sw = new Rectangle(x, y + h / 2, w / 2, h / 2)
        this.southweast = new Quadtree(sw, this.capacity)
        var se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2)
        this.southeast = new Quadtree(se, this.capacity)
        this.subdivided = true
    }

    show() {
        stroke(0)
        noFill()
        strokeWeight(1)
        rect(this.boundaries.x, this.boundaries.y, this.boundaries.w, this.boundaries.h)
        if (this.subdivided) {
            this.northweast.show()
            this.northeast.show()
            this.southweast.show()
            this.southeast.show()
        }
    }

}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h
    }
}

class Point {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    render() {
        strokeWeight(this.radius)
        fill(100)
        point(this.x, this.y, this.radius)
    }
}