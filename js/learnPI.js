PI_0_99 = "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"
PI_100_199 = "8214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196"
    //console.log(PI_100_199.slice(101, 202))

const input = document.getElementById('input');
input.addEventListener('input', function() {
    if (this.value[this.value.length - 1] == PI[this.value.length - 1]) {
        document.getElementById("input").style.borderColor = "green"
    } else {
        document.getElementById("input").style.borderColor = "red"
    }
});