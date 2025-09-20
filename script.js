import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, flowers;

function init() {
    // 1. Configurar la escena
    scene = new THREE.Scene();
    
    // 2. Configurar la cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 3. Configurar el renderizador
    const canvas = document.getElementById('scene-container');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 4. Añadir luces
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    // 5. Cargar el modelo 3D de las flores
    const loader = new GLTFLoader();
    loader.load('Assets/Flowers.glb', (gltf) => {
        flowers = gltf.scene;
        scene.add(flowers);

        // Ajustar posición y escala si es necesario
        flowers.scale.set(1, 1, 1);
        flowers.position.y = -1;

        // Iniciar la animación
        animate();
    });

    // Manejar el redimensionamiento de la ventana
    window.addEventListener('resize', onWindowResize);

    // Manejar el clic en el botón de "¡Click Me!"
    document.querySelector('.click-me-box').addEventListener('click', () => {
        document.querySelector('.click-me-box').classList.add('hidden');
        const messageBox = document.querySelector('.message-box');
        messageBox.style.display = 'block'; // Mostrar el mensaje
        setTimeout(() => {
            messageBox.style.opacity = '1';
        }, 10);
        document.getElementById('audio').play(); // Reproducir la música
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Animar las flores (un ejemplo simple de rotación)
    if (flowers) {
        flowers.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

// Iniciar la aplicación
init();
// La variable para el PIN correcto. Puedes cambiarlo aquí.
const CORRECT_PIN = "2109"; 

// --- Lógica del Candado ---
const pinLockScreen = document.getElementById('pin-lock');
const pinInputs = document.querySelectorAll('.pin-input');
const unlockBtn = document.getElementById('unlock-btn');
const overlayContainer = document.getElementById('overlay');

// El resto de la página se oculta inicialmente
overlayContainer.style.display = 'none';

pinInputs[0].focus(); // Enfoca el primer campo al cargar

// Mueve el foco al siguiente campo automáticamente
pinInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < pinInputs.length - 1) {
            pinInputs[index + 1].focus();
        }
    });
});

unlockBtn.addEventListener('click', () => {
    let enteredPin = "";
    pinInputs.forEach(input => {
        enteredPin += input.value;
    });

    if (enteredPin === CORRECT_PIN) {
        // Si el PIN es correcto, desbloquea la pantalla
        pinLockScreen.classList.add('pin-unlocked');
        // Muestra el resto de la página
        overlayContainer.style.display = 'flex';
    } else {
        // Si el PIN es incorrecto, reinicia los campos y muestra un mensaje
        alert("PIN incorrecto. Inténtalo de nuevo.");
        pinInputs.forEach(input => {
            input.value = '';
        });
        pinInputs[0].focus();
    }
});

// --- Lógica de la animación 3D ---
// Pega todo tu código actual de init() y animate() aquí, sin la llamada a init()
// ... (Todo el código de init(), animate(), etc. de tu script.js)
// Asegúrate de que init() no se llame hasta que la pantalla de bloqueo esté desbloqueada
// Puedes llamarla al final del script si la pantalla de bloqueo se oculta al inicio.
init();
