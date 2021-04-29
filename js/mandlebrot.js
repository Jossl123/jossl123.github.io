var itt = 0


var magnificationFactor = 200;
var panX = 200;
var panY = 200;
var zoomOffset = 200


var moved = false

function setup() {
    createCanvas(windowWidth, windowHeight)
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            var color = checkIfBelongsToMandelbrotSet(x / magnificationFactor - panX / magnificationFactor,
                y / magnificationFactor - panY / magnificationFactor);
            var index = (x + y * width) * 4
            pixels[index] = color * color * 255
            pixels[index + 1] = Math.sqrt(color) * 255
            pixels[index + 2] = color * 255
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
}

function draw() {
    keyDown();
    if (moved) {
        loadPixels();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                var color = checkIfBelongsToMandelbrotSet(x / magnificationFactor - panX / magnificationFactor,
                    y / magnificationFactor - panY / magnificationFactor);
                var index = (x + y * width) * 4
                pixels[index] = color * color * 255
                pixels[index + 1] = Math.sqrt(color) * 255
                pixels[index + 2] = color * 255
                pixels[index + 3] = 255;
            }
        }
        updatePixels();
        moved = false
    }
}

function mouseClicked(event) {
    var x = event.screenX
    var y = event.screenY
    magnificationFactor += zoomOffset
    panX += width / 2 - x + zoomOffset / 10
    panY += height / 2 - y + zoomOffset / 10
    zoomOffset += 20
    moved = true
}

function checkIfBelongsToMandelbrotSet(x, y) {
    var realComponentOfResult = x;
    var imaginaryComponentOfResult = y;
    var maxIterations = 100;
    for (var i = 0; i < maxIterations; i++) {
        var tempRealComponent = realComponentOfResult * realComponentOfResult -
            imaginaryComponentOfResult * imaginaryComponentOfResult +
            x;
        var tempImaginaryComponent = 2 * realComponentOfResult * imaginaryComponentOfResult +
            y;
        realComponentOfResult = tempRealComponent;
        imaginaryComponentOfResult = tempImaginaryComponent;

        // Return a number as a percentage
        if (realComponentOfResult * imaginaryComponentOfResult > 5)
            return (i / maxIterations);
    }
    return 0; // Return zero if in set        
}


function keyDown() {
    if (keyIsDown(LEFT_ARROW)) {
        panX += 20 / magnificationFactor
    }
    if (keyIsDown(RIGHT_ARROW)) {
        panX -= 20 / magnificationFactor
    }
    if (keyIsDown(UP_ARROW)) {
        panY += 20 / magnificationFactor
    }
    if (keyIsDown(DOWN_ARROW)) {
        panY -= 20 / magnificationFactor
    }
    if (keyIsDown(90)) {
        magnificationFactor += 100
    }
    if (keyIsDown(83)) {
        magnificationFactor -= 100
    }
}