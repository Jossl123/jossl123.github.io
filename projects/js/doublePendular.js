var r1 = 200;
var r2 = 200;

var a1 = Math.PI / Math.random() * 2 + 1;
var a2 = Math.PI / 2;
var a1_v = 0;
var a2_v = 0;

var m1 = 50;
var m2 = 50;

var x0 = window.innerWidth / 2;
var y0 = window.innerHeight / 4;

var x1, y1, x2, y2, num1, num2, num3, den1, num4
var prevPoints = [
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ],
    [, ]
]

var g = 2;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {

    background(255)
    for (let i = prevPoints.length - 1; i >= 0; i--) {
        var prevx = prevPoints[i][0];
        var prevy = prevPoints[i][1]
        if (prevx) {
            if (i == 0) {
                line(prevx, prevy, x2, y2)
            } else {
                stroke(100 + i * 155 / prevPoints.length, 150 + i * 105 / prevPoints.length, 100 + i * 155 / prevPoints.length);
                line(prevPoints[i - 1][0], prevPoints[i - 1][1], prevx, prevy)
            }
        }
    }
    for (let i = prevPoints.length - 1; i >= 0; i--) {
        if (i == 0) {
            prevPoints[i][0] = x2
            prevPoints[i][1] = y2
        } else {
            prevPoints[i][0] = prevPoints[i - 1][0]
            prevPoints[i][1] = prevPoints[i - 1][1]
        }
    }
    fill(0)
    stroke(0);
    ellipse(x0, y0, 15);

    strokeWeight(2)


    num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    num3 = -2 * Math.sin(a1 - a2) * m2
    num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2)
    den1 = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2))

    var a1_a = (num1 + num2 + num3 * num4) / den1;

    num1 = 2 * Math.sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2))
    num3 = g * (m1 + m2) * Math.cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2)
    den1 = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2))

    var a2_a = (num1 * (num2 + num3 + num4)) / den1;

    x1 = r1 * Math.sin(a1) + x0;
    y1 = r1 * Math.cos(a1) + y0;

    x2 = x1 + r2 * Math.sin(a2);
    y2 = y1 + r2 * Math.cos(a2);

    line(x0, y0, x1, y1)
    fill(0)
    ellipse(x1, y1, m1, m1);

    line(x1, y1, x2, y2)
    fill(0)
    ellipse(x2, y2, m2, m2);

    a1_v += a1_a;
    a2_v += a2_a;

    a1 += a1_v * 0.998;
    a2 += a2_v * 0.998;
}