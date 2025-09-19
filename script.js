import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';

const loader = document.getElementById('loader');
const container = document.getElementById('container');
const progressText = document.getElementById('progress');

let modelLoaded = false;

// -------------------------------------------------------------
// 1. CONFIGURACIÓN BÁSICA DE LA ESCENA THREE.JS
// -------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Agrega una luz para que el modelo no se vea completamente negro
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// -------------------------------------------------------------
// 2. CARGAR EL MODELO 3D DE LAS FLORES
// -------------------------------------------------------------
const gltfLoader = new GLTFLoader();

function loadModel() {
    // Reemplaza 'ruta/a/tu/modelo.gltf' con la ruta real de tu archivo de flores
    gltfLoader.load('ruta/a/tu/modelo.gltf', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        
        // Simplemente movemos la cámara para ver el modelo
        camera.position.set(0, 1.5, 4); 

        // Una vez que el modelo se carga, actualizamos el estado
        modelLoaded = true;

    }, (xhr) => {
        // Esto es para la pantalla de carga, actualiza el porcentaje
        let progress = Math.round(xhr.loaded / xhr.total * 100);
        progressText.textContent = progress;
        if (progress === 100) {
            // Ocultamos el loader cuando la carga es completa
            loader.style.display = 'none';
            container.style.display = 'block';
            setTimeout(() => {
                container.classList.add('visible');
            }, 100);
        }
    }, (error) => {
        console.error('An error happened:', error);
    });
}

// -------------------------------------------------------------
// 3. BUCLE DE ANIMACIÓN
// -------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Llamamos a la función de carga e iniciamos la animación
loadModel();
animate();

// Maneja el redimensionamiento de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
