class Camera {
    constructor() {
        this.pos = createVector(11.810494016852257, 35.917491249333054, -69.58120603956999);
        this.fov = 90;
        this.dir = createVector(-34.89949670250097, -173.54239588891244, 984.2078347376881);
        this.ax = 10;
        this.ay = -2;
        this.az = 0;
        this.distFromScreen = 1000;
        this.speed = 2
    }
}

class Light {
    constructor() {
        this.pos = createVector(100, 400, 100);
        this.r = 2;
        this.color = [252, 212, 100]
    }
}

class Sphere {
    constructor(x, y, z, r, color, bounce = false) {
        this.pos = createVector(x, y, z);
        this.r = r
        this.color = color
        this.bounce = bounce
    }
    getDist(point) {
        return distancePoints(this.pos, point) - this.r
            //return distancePoints(this.pos, createVector(point.x % 10, point.y % 10, point.z % 10)) - this.r
    }
}

class Cube {
    constructor(x, y, z, w, h, depth, color, bounce = false) {
        this.pos = createVector(x, y, z);
        this.size = createVector(w, h, depth)
        this.color = color
        this.bounce = bounce
    }
    getDist(point) {
        var q = absVector(point.copy().sub(this.pos)).sub(this.size)
        return length(maxVector(q, createVector(0, 0, 0))) + Math.min(Math.max(q.x, Math.max(q.y, q.z)), 0);
    }
}

class RoundedCube {
    constructor(x, y, z, w, h, depth, r, color, bounce = false) {
        this.pos = createVector(x, y, z);
        this.size = createVector(w, h, depth)
        this.r = r
        this.color = color;
        this.bounce = bounce
    }
    getDist(point) {
        var q = absVector(point.copy().sub(this.pos)).sub(this.size)
        return length(maxVector(q, createVector(0, 0, 0))) + Math.min(Math.max(q.x, Math.max(q.y, q.z)), 0) - this.r;
    }
}

class Plane {
    constructor(y, color, bounce = false) {
        this.y = y
        this.color = color,
            this.bounce = bounce
    }
    getDist(point) {
        return point.y - this.y
    }
}

class Triangle {
    constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, color, bounce = false) {
        this.a = createVector(x1, y1, z1)
        this.b = createVector(x1, y1, z1)
        this.c = createVector(x1, y1, z1)
        this.ba = b.copy().sub(a);
        this.cb = c.copy().sub(b);
        this.ac = a.copy().sub(c);
        this.nor = this.ba.cross(this.ac)
        this.color = color
        this.bounce = bounce
    }
    getDist(point) {
        var pa = point.copy().sub(this.a)
        var pb = point.copy().sub(this.b)
        var pc = point.copy().sub(this.c)
        if (Math.sign(this.ba.cross(this.nor).dot(pa)) +
            Math.sign(this.cb.cross(this.nor).dot(pb)) +
            Math.sign(this.ac.cross(this.nor).dot(pc)) < 2) {
            //test
        } else {
            //finish
        }
        return point.dot(this.pos) + 0
    }
}