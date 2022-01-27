var pastValue = ""
var mode = 0 // 0 = normal;  1 = timer;  2 = hardcore
var pastTime, time = Date.now()
var timer
const input = document.getElementById('input');
input.addEventListener('input', function() {
    var time = Date.now();
    if (this.value.length - pastValue.length > 1) { // if player put 2 or more number at one time
        input.value = ""
        alert("Tried to cheat ?")
    }
    if (this.value.length == 1) pastTime = Date.now()
    if (this.value.length == 0) {
        document.getElementById("input").style.borderColor = "lightgray";
        document.getElementById("timer").style.visibility = "hidden"
        clearInterval(timer)
    } else if (this.value[this.value.length - 1] == PI[this.value.length - 1]) document.getElementById("input").style.borderColor = "green"
    else { //raté
        if (mode == 2) input.value = ""
        document.getElementById("input").style.borderColor = "rgb(185 28 28)"
    }
    if (mode == 1 && this.value.length == 1) {
        document.getElementById("timer").style.visibility = "visible"
        timer = setInterval(function() {
            time = Date.now()
            document.getElementById("timer").innerHTML = (time - pastTime) / 1000
        }, 10)
    }
    pastValue = this.value
});

function changeMode(i) {
    mode = i
}