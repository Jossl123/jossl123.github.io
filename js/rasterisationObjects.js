function Planet(p, r, mins, maxs, oceanLvl) {
    var c = [255, 0, 0]
    planeFacePlanet(p, r, mins, maxs, oceanLvl, createVector(0, 1, 0))
    planeFacePlanet(p, r, mins, maxs, oceanLvl, createVector(1, 0, 0))
    planeFacePlanet(p, r, mins, maxs, oceanLvl, createVector(0, 0, 1))
    planeFacePlanet(p, r, mins, maxs, oceanLvl, createVector(0, -1, 0))
    planeFacePlanet(p, r, mins, maxs, oceanLvl, createVector(-1, 0, 0))
    planeFacePlanet(p, r, mins, maxs, oceanLvl, createVector(0, 0, -1))
}

function Sphere(p, s, r, c) { //pas encore implémenté
    planeFace(p, r, createVector(0, 1, 0), c)
    planeFace(p, r, createVector(1, 0, 0), c)
    planeFace(p, r, createVector(0, 0, 1), c)
    planeFace(p, r, createVector(0, -1, 0), c)
    planeFace(p, r, createVector(-1, 0, 0), c)
    planeFace(p, r, createVector(0, 0, -1), c)
}

function Cube(p, s, c) {
    planeFace(p, s, 2, createVector(0, 1, 0), c)
    planeFace(p, s, 2, createVector(1, 0, 0), c)
    planeFace(p, s, 2, createVector(0, 0, 1), c)
    planeFace(p, s, 2, createVector(0, -1, 0), c)
    planeFace(p, s, 2, createVector(-1, 0, 0), c)
    planeFace(p, s, 2, createVector(0, 0, -1), c)
}

function planeFace(p, s, r, dir, c) {
    if (r <= 1) return
    var triIndex = points.length
    var vA = createVector(dir.y, dir.z, dir.x)
    var vB = vA.cross(dir)
    for (let y = 0; y < r; y++) {
        for (let x = 0; x < r; x++) {
            var percent = createVector(x, y).div(r - 1)
            var pointOnCube = dir.copy().add(vA.copy().mult((percent.x - 0.5) * 2)).add(vB.copy().mult((percent.y - 0.5) * 2)).mult(s / r)
            pointOnCube.setMag(s)
            pointOnCube.add(p)
            points.push([createVector(pointOnCube.x, pointOnCube.y, pointOnCube.z), c]) //add point
        }
    }
    for (let y = 0; y < r - 1; y++) {
        for (let x = 0; x < r - 1; x++) {
            var i = x + y * r
            verticies.push(new Triangle(points[triIndex + i][0], points[triIndex + i + 1][0], points[triIndex + i + r + 1][0], points[triIndex + i + 1][1]))
            verticies.push(new Triangle(points[triIndex + i][0], points[triIndex + r + i + 1][0], points[triIndex + i + r][0], points[triIndex + i][1]))
        }
    }
}

function mixColors(c1, c2, percent) {
    return [c1[0] * percent + c2[0] * (1 - percent), c1[1] * percent + c2[1] * (1 - percent), c1[2] * percent + c2[2] * (1 - percent)]
}