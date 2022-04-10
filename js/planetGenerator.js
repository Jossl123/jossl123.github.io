function modify(y, r) {
    document.getElementById("myBar").style.width = Math.floor(y / r * 100) + "%"
        //document.getElementById("myBar").innerHTML = Math.floor(y / r * 100) + "%"
}

function planeFace(p, r, mins, maxs, oceanLvl, dir) {
    if (r <= 1) return
    var triIndex = points.length
    var vA = createVector(dir.y, dir.z, dir.x)
    var vB = vA.cross(dir)
    for (let y = 0; y < r; y++) {
        for (let x = 0; x < r; x++) {
            var percent = createVector(x, y).div(r - 1)
            var pointOnCube = dir.copy().add(vA.copy().mult((percent.x - 0.5) * 2)).add(vB.copy().mult((percent.y - 0.5) * 2)).mult(mins / r)
            pointOnCube.setMag(1)
                //pointOnCube.setMag(s + Math.sin((pointOnCube.x * pointOnCube.y) * 5) / 10) // cool ball
                //pointOnCube.setMag(s + Math.sin((pointOnCube.x + pointOnCube.y) * 5) / 10) // cool ball
            var n = HandleNoiseHeight(pointOnCube, 7)
                // n = Math.max(oceanLvl, n)
                //var nc = [(1 - (n * 2 - 1)) * 255, 255, 0] // max value = 2/1.6*s
            var mask = HandleNoiseHeight(pointOnCube, 2)
            mask *= 5
            mask = clamp(mask, 0.7, 1)
            n = (1 - Math.abs(Math.sin(n * mask))) ** 2
            n = clamp(n, oceanLvl, 1)
            pointOnCube.setMag(n * (maxs - mins) + mins)
            pointOnCube.add(p)
                //var nc = [(n - oceanLvl) / (1 - oceanLvl) * 255, (n - oceanLvl) / (1 - oceanLvl) * 255 / 2 + 125, 0]
            var nTo1 = (n - oceanLvl) / (1 - oceanLvl)
            var nc = mixColors(mixColors([200, 125, 0], [0, 255, 0], nTo1 ** 1.2), [255, 255, 0], Math.sqrt(nTo1))
            if (n <= oceanLvl) nc = [0, 0, 200]
            points.push([createVector(pointOnCube.x, pointOnCube.y, pointOnCube.z), nc]) //add point
        }
        modify(y, r)
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

function HandleNoiseHeight(p, itt) {
    var pn = 0
    for (let i = 0; i < itt; i++) {
        pn += perlin.get(p.x * 2 ** i + (i * 10), p.y * 2 ** i + i * 15, p.z) / 2 ** i
    }
    return pn
}