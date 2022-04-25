var layers = [2, 3, 500, 2]
var weights_shape = []
for (let i = 0; i < layers.length - 1; i++) {
    weights_shape.push([layers[i + 1], layers[i]])
}
var weights = []
for (let i = 0; i < weights_shape.length; i++) {
    weights.push(math.ones(weights_shape[i][0], weights_shape[i][1]))
        //randomize values
    for (let y = 0; y < weights_shape[i][0]; y++) {
        for (let x = 0; x < weights_shape[i][1]; x++) {
            weights[i]._data[y][x] = Math.random() / weights_shape[i][1] ** 0.5
        }
    }
}
var biases = []
for (let i = 1; i < layers.length; i++) {
    biases.push(math.zeros(layers[i], 1))
}

function predict(m) {
    var currentM = m
    for (let i = 0; i < weights.length; i++) {
        currentM = math.multiply(weights[i], currentM)
        currentM = math.add(biases[i], currentM)
        for (let m = 0; m < currentM._data.length; m++) {
            currentM._data[m] = [activationFonction(currentM._data[0])]
        }
    }
    return currentM
}

function activationFonction(x) {
    return 1 / (1 - Math.exp(-x))
}

function drawNetwork() {
    return
}
console.log(predict(math.matrix([
    [0],
    [1]
])))