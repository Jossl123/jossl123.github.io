function startAudio() {
    let src = '../music/The_backroom_dance_Waka_Waka.mp3'

    const audio = new Audio(src);
    const audioContext = new(window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    console.log(analyser)
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    const barWidth = (canvas.width / bufferLength) * 2.5;

    let animationId;

    function draw() {
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let x = 0;
        // For simplicity, let's use the average frequency as a threshold
        const averageFrequency = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

        if (averageFrequency > 100) {
            spawnDiv();
        }

        dataArray.forEach(value => {
            const barHeight = value;

            ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        });

        animationId = requestAnimationFrame(draw);
    }
    audio.play();
    draw();
    // Pause the visualization when the audio is paused
    audio.addEventListener('pause', function() {
        cancelAnimationFrame(animationId);
    });

    // Stop the visualization when the audio ends
    audio.addEventListener('ended', function() {
        cancelAnimationFrame(animationId);
    });
}

document.getElementById('startButton').addEventListener('click', startAudio);


function spawnDiv() {
    const spawnedDiv = document.createElement('div');
    spawnedDiv.className = 'spawned-div';
    document.body.appendChild(spawnedDiv);

    setTimeout(() => {
        document.body.removeChild(spawnedDiv);
    }, 10); // Adjust the duration the div is visible
}