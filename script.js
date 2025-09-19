const music = document.getElementById('music');
const lyricsContainer = document.querySelector('.lyrics');

// Define aquí las letras y el tiempo en milisegundos
const lyricsData = [
    { time: 1000, text: "Cuando te veo sonreír," },
    { time: 3000, text: "mi mundo se llena de color." },
    { time: 6000, text: "Y estas flores amarillas" },
    { time: 9000, text: "son un pequeño gesto de mi amor." }
];

let currentIndex = 0;

music.addEventListener('timeupdate', () => {
    const currentTime = music.currentTime * 1000;

    if (currentIndex < lyricsData.length && currentTime >= lyricsData[currentIndex].time) {
        lyricsContainer.textContent = lyricsData[currentIndex].text;
        lyricsContainer.classList.add('visible');
        currentIndex++;
    }
});

// Oculta las letras al final
music.addEventListener('ended', () => {
    lyricsContainer.classList.remove('visible');
});

// Para iniciar el audio si el navegador lo bloquea
document.addEventListener('click', () => {
    music.play().catch(error => {
        console.log("No se pudo iniciar la reproducción automática:", error);
    });
});
