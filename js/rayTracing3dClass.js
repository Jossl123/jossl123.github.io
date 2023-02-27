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
    getColor(point) { return this.color }
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
            //return distancePoints(this.pos, point) - this.r + Math.sin(point.x) * 2 - Math.cos(point.y)
            //return distancePoints(this.pos, createVector(point.x % 10, point.y % 10, point.z % 10)) - this.r
    }
    getColor(point) {
        var n = getNormal(point)
        return [n.x * 255, n.y * 255, n.z * 255]
    }
}

class SmoothTwoSpheres {
    constructor(x1, y1, z1, x2, y2, z2, r1, r2, color1, color2, k, bounce = false) {
        this.pos1 = createVector(x1, y1, z1);
        this.r1 = r1
        this.pos2 = createVector(x2, y2, z2);
        this.r2 = r2
        this.color = color1
        this.color2 = color2
        this.k = k
        this.bounce = bounce
    }
    getDist(point) {
        var dist1 = distancePoints(this.pos1, point) - this.r1
        var dist2 = distancePoints(this.pos2, point) - this.r2
        var h = Math.max(this.k - Math.abs(dist1 - dist2), 0) / this.k;
        return Math.min(dist1, dist2) - h * h * h * this.k * 1 / 6;
    }
    getColor(point) { return this.color }
}

class MandleBulb {
    constructor() {
        this.bailout = 2;
        this.power = 10
        this.color = [255, 0, 0]
        this.bounce = false
    }
    getDist(point) {
        var z = point.copy().sub(createVector(0, 0, 200));
        var dr = 1
        var r = 0;
        for (var i = 0; i < 15; i++) {
            r = z.mag();
            if (r > this.bailout) break;

            // convert to polar coordinates
            var theta = Math.acos(z.z / r);
            var phi = Math.atan(z.y, z.x);
            dr = Math.pow(r, this.power - 1) * this.power * dr + 1;

            // scale and rotate the point
            var zr = Math.pow(r, this.power);
            theta = theta * this.power;
            phi = phi * this.power;

            // convert back to cartesian coordinates
            z = zr * createVector(Math.sin(theta) * Math.cos(phi), Math.sin(phi) * Math.sin(theta), Math.cos(theta));
            z += pos.copy();
        }
        return 0.5 * Math.log(r) * r / dr;

    }
    getColor(point) { return this.color }
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
    getColor(point) { return this.color }
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
    getColor(point) { return this.color }
}

class Plane {
    constructor(y, color, bounce = false) {
        this.y = y
        this.color = color
        this.bounce = bounce
    }
    getDist(point) {
        return point.y - this.y
    }
    getColor(point) { return this.color }
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
    getColor(point) { return this.color }
}

function absVector(v) {
    return createVector(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z))
}

function maxVector(v1, v2) {
    return createVector(Math.max(v1.x, v2.x), Math.max(v1.y, v2.y), Math.max(v1.z, v2.z))
}

function minVector(v1, v2) {
    return createVector(Math.min(v1.x, v2.x), Math.min(v1.y, v2.y), Math.min(v1.z, v2.z))
}