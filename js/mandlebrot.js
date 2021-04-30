var magnificationFactor = 200;
var panX = 600;
var panY = 400;
var zoomOffset = 200
var moved = false
var colorRange = 255
var mapping = [
    [66, 10, 10],
    [25, 7, 26],
    [9, 1, 47],
    [4, 4, 73],
    [0, 7, 100],
    [12, 44, 138],
    [24, 82, 177],
    [57, 125, 209],
    [134, 181, 229],
    [211, 236, 248],
    [241, 233, 191],
    [248, 201, 95],
    [255, 170, 0],
    [204, 128, 0],
    [153, 87, 0],
    [106, 52, 3]
]

var colorPicker1
var colorPicker2
var colorPicker3

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorPicker1 = createColorPicker('#ed225d')
    colorPicker2 = createColorPicker('#ff0000')
    colorPicker3 = createColorPicker('#ff88AA')
    render()
}

function draw() {
    keyDown();
    if (moved) {
        render()
    }
}

function mouseClicked(event) {
    var x = event.screenX
    var y = event.screenY
    magnificationFactor += zoomOffset
    panX += width / 2 - x + zoomOffset / 5
    panY += height / 2 - y + zoomOffset / 5
    zoomOffset += 20
    moved = true
}

function render() {
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            var color = checkIfBelongsToMandelbrotSet(x / magnificationFactor - panX / magnificationFactor,
                y / magnificationFactor - panY / magnificationFactor);
            var index = (x + y * width) * 4
            pixels[index] = color[0]
            pixels[index + 1] = color[1]
            pixels[index + 2] = color[2]
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
    moved = false
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
        if (realComponentOfResult * imaginaryComponentOfResult > 2) {
            return mapping[Math.floor(i / maxIterations * mapping.length)];

            //return colorGradient(i / maxIterations, { red: colorPicker1.color().levels[0], green: colorPicker1.color().levels[1], blue: colorPicker1.color().levels[2] }, { red: colorPicker2.color().levels[0], green: colorPicker2.color().levels[1], blue: colorPicker2.color().levels[2] }, { red: colorPicker3.color().levels[0], green: colorPicker3.color().levels[1], blue: colorPicker3.color().levels[2] })
        }
    }
    return [0, 0, 0]; // Return zero if in set        
}

function keyDown() {
    if (keyIsDown(LEFT_ARROW)) {
        panX += zoomOffset / 10
        moved = true
    }
    if (keyIsDown(RIGHT_ARROW)) {
        panX -= zoomOffset / 10
        moved = true
    }
    if (keyIsDown(UP_ARROW)) {
        panY += zoomOffset / 10
        moved = true
    }
    if (keyIsDown(DOWN_ARROW)) {
        panY -= zoomOffset / 10
        moved = true
    }
    if (keyIsDown(90)) {
        magnificationFactor += zoomOffset
        panX += zoomOffset / 10
        panY += zoomOffset / 10
        moved = true
    }
    if (keyIsDown(83)) {
        magnificationFactor += zoomOffset
        panX -= zoomOffset / 10
        panY -= zoomOffset / 10
        moved = true
    }
}

function colorGradient(fadeFraction, rgbColor1, rgbColor2, rgbColor3) {
    var color1 = rgbColor1;
    var color2 = rgbColor2;
    var fade = fadeFraction;

    // Do we have 3 colors for the gradient? Need to adjust the params.
    if (rgbColor3) {
        fade = fade * 2;

        // Find which interval to use and adjust the fade percentage
        if (fade >= 1) {
            fade -= 1;
            color1 = rgbColor2;
            color2 = rgbColor3;
        }
    }

    var diffRed = color2.red - color1.red;
    var diffGreen = color2.green - color1.green;
    var diffBlue = color2.blue - color1.blue;

    var gradient = {
        red: parseInt(Math.floor(color1.red + (diffRed * fade)), 10),
        green: parseInt(Math.floor(color1.green + (diffGreen * fade)), 10),
        blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)), 10),
    };

    return [gradient.red, gradient.green, gradient.blue];
}