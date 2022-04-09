function Planet(p, r, mins, maxs, oceanLvl) {
    var c = [255, 0, 0]
    planeFace(p, r, mins, maxs, oceanLvl, createVector(0, 1, 0))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(1, 0, 0))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(0, 0, 1))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(0, -1, 0))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(-1, 0, 0))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(0, 0, -1))
}

function Sphere(p, s, r, c) {
    planeFace(p, r, mins, maxs, oceanLvl, createVector(0, 1, 0))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(1, 0, 0))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(0, 0, 1))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(0, -1, 0))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(-1, 0, 0))
    planeFace(p, r, mins, maxs, oceanLvl, createVector(0, 0, -1))
}