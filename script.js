const loader = document.getElementById('loader');
const container = document.getElementById('container');
const progressText = document.getElementById('progress');

let progress = 0;

// Simulación de carga
function simulateLoading() {
    const interval = setInterval(() => {
        if (progress < 100) {
            progress += 1;
            progressText.textContent = progress;
        } else {
            clearInterval(interval);
            // Cuando la carga llega al 100%, ocultamos el loader y mostramos el contenido.
            loader.style.display = 'none';
            container.style.display = 'block';
            setTimeout(() => {
                container.classList.add('visible');
            }, 100);
        }
    }, 20); // Simula una carga de 2 segundos
}

simulateLoading();
