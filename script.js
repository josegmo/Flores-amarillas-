import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, flowers;
let raycaster, mouse, clickablePlane;
let clickMeVisible = true;

// El PIN que el usuario debe ingresar para desbloquear. Puedes cambiarlo aquí.
const CORRECT_PIN = "2109"; 

// --- Lógica del Candado ---
const pinLockScreen = document.getElementById('pin-lock');
const pinInputs = document.querySelectorAll('.pin-input');
const unlockBtn = document.getElementById('unlock-btn');
const loadingScreen = document.getElementById('loading-screen');
const overlayContainer = document.getElementById('overlay');
const clickMeBox = document.querySelector('.click-me-box');
const messageBox = document.querySelector('.message-box');
const dedicationBox = document.querySelector('.dedication-box');

// Muestra el candado y oculta el resto de la página al inicio
overlayContainer.style.display = 'none';

pinInputs[0].focus();

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
        // PIN correcto, oculta el candado y muestra la pantalla de carga
        pinLockScreen.classList.add('pin-unlocked');
        loadingScreen.classList.remove('hidden-loading');
        
        // Inicia el proceso de carga y animación
        init();
    } else {
        alert("PIN incorrecto. Inténtalo de nuevo.");
        pinInputs.forEach(input => {
            input.value = '';
        });
        pinInputs[0].focus();
    }
});

// --- Lógica de la animación 3D ---
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

        // Ocultar la pantalla de carga después de que el modelo 3D se cargue
        loadingScreen.classList.add('hidden-loading');
        overlayContainer.style.display = 'flex'; // Mostrar la interfaz principal

        // Ajustar posición y escala si es necesario
        flowers.scale.set(1, 1, 1);
        flowers.position.y = -1;

        // Iniciar la animación
        animate();
    });

    // 6. Configurar la zona de clic para la dedicatoria
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    clickablePlane = new THREE.Mesh(geometry, material);
    clickablePlane.rotation.x = -Math.PI / 2;
    clickablePlane.position.y = -1;
    scene.add(clickablePlane);

    window.addEventListener('click', onMouseClick, false);
    
    // Manejar el redimensionamiento de la ventana
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (flowers) {
        flowers.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

// Función para manejar los clics del mouse
function onMouseClick(event) {
    // Si la caja de "Click Me!" está visible, al hacer clic en cualquier lugar se oculta
    if (clickMeVisible) {
        clickMeBox.classList.add('hidden');
        clickMeVisible = false;

        // Mostrar el mensaje principal después de un clic
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.opacity = '1';
        }, 10);
        document.getElementById('audio').play();
    } else {
        // Convertir las coordenadas del mouse a un rango de -1 a +1
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object === clickablePlane) {
                // Si el clic es en el plano invisible, mostrar la dedicatoria
                dedicationBox.classList.remove('hidden');
                dedicationBox.style.opacity = '1';
                // Ocultar el mensaje principal
                messageBox.classList.add('hidden');
            }
        }
    }
}
