import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, flowers;
let raycaster, mouse, clickablePlane;
let clickMeVisible = true;

const CORRECT_PIN = "2109"; 

const pinLockScreen = document.getElementById('pin-lock');
const pinInputs = document.querySelectorAll('.pin-input');
const unlockBtn = document.getElementById('unlock-btn');
const loadingScreen = document.getElementById('loading-screen');
const overlayContainer = document.getElementById('overlay');
const clickMeBox = document.querySelector('.click-me-box');
const messageBox = document.querySelector('.message-box');
const dedicationBox = document.querySelector('.dedication-box');

// Oculta la interfaz principal y la pantalla de carga al inicio
overlayContainer.classList.add('hidden');
loadingScreen.classList.add('hidden');

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
        pinLockScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        
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

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const canvas = document.getElementById('scene-container');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('Assets/Flowers.glb', (gltf) => {
        flowers = gltf.scene;
        scene.add(flowers);

        flowers.scale.set(1, 1, 1);
        flowers.position.y = -1;

        // Ocultar la pantalla de carga y mostrar la interfaz principal
        loadingScreen.classList.add('hidden');
        overlayContainer.classList.remove('hidden');

        animate();
    });

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    clickablePlane = new THREE.Mesh(geometry, material);
    clickablePlane.rotation.x = -Math.PI / 2;
    clickablePlane.position.y = -1;
    scene.add(clickablePlane);

    window.addEventListener('click', onMouseClick, false);
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

function onMouseClick(event) {
    if (clickMeVisible) {
        clickMeBox.classList.add('hidden');
        clickMeVisible = false;

        messageBox.classList.remove('hidden');
        document.getElementById('audio').play();
    } else {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object === clickablePlane) {
                dedicationBox.classList.remove('hidden');
                messageBox.classList.add('hidden');
                break;
            }
        }
    }
}
