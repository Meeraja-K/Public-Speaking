import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.onload = () => loadModel();

let sound, mixer, TalkAction, analyser, jawBone, leftHandBone, rightHandBone;

function loadModel() {
  const loader = new GLTFLoader();
  loader.load('avatar.glb',
    (gltf) => {
      setupScene(gltf);
      document.getElementById('avatar-loading').style.display = 'none';
    },
    (xhr) => {
      const percentCompletion = Math.round((xhr.loaded / xhr.total) * 100);
      document.getElementById('avatar-loading').innerText = `LOADING... ${percentCompletion}%`; // Fixed template literal
      console.log(`Loading model... ${percentCompletion}%`); // Fixed template literal
    },
    (error) => {
      console.error(error);
    }
  );
}


function setupScene(gltf) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const container = document.getElementById('avatar-container');
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight);
  camera.position.set(0.2, 0.5, 1);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minDistance = 3;
  controls.minPolarAngle = 1.4;
  controls.maxPolarAngle = 1.4;
  controls.target = new THREE.Vector3(0, 0.75, 0);
  controls.update();

  // Scene setup
  const scene = new THREE.Scene();

  // Lighting setup
  scene.add(new THREE.AmbientLight());

  const spotlight = new THREE.SpotLight(0xffffff, 20, 8, 1);
  spotlight.penumbra = 0.5;
  spotlight.position.set(0, 4, 2);
  spotlight.castShadow = true;
  scene.add(spotlight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2);
  keyLight.position.set(1, 1, 2);
  keyLight.lookAt(new THREE.Vector3());
  scene.add(keyLight);

  // Load avatar and find the jaw and hand bones
  const avatar = gltf.scene;
  avatar.traverse((child) => {
      if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
      }
      if (child.name === "Jaw") {
          jawBone = child;
      }
      if (child.name === "LeftHand") { // Replace with actual left hand bone name if different
          leftHandBone = child;
      }
      if (child.name === "RightHand") { // Replace with actual right hand bone name if different
          rightHandBone = child;
      }
  });
  avatar.position.set(0, -0.8, -0.5);
  scene.add(avatar);

  // Remove the pedestal code entirely!
  // Ensure nothing else similar to the pedestal is added.

  // Load animations
  mixer = new THREE.AnimationMixer(avatar);
  const clips = gltf.animations;
  const TalkClip = THREE.AnimationClip.findByName(clips, 'Talking');
  TalkAction = mixer.clipAction(TalkClip);

  // Set up audio with analyser
  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
  analyser = new THREE.AudioAnalyser(sound, 32);

  // Set up audio file upload handling
  document.getElementById('audio-upload').addEventListener('change', handleAudioUpload);

  // Raycaster for interaction
  const raycaster = new THREE.Raycaster();
  container.addEventListener('mousedown', (ev) => {
      const coords = {
          x: (ev.offsetX / container.clientWidth) * 2 - 1,
          y: -(ev.offsetY / container.clientHeight) * 2 + 1
      };
      raycaster.setFromCamera(coords, camera);
      const intersections = raycaster.intersectObject(avatar);
  });

  // Event listener for reset button
  document.getElementById('reset-button').addEventListener('click', resetToAttentionPosition);

  window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      mixer.update(delta);

      // Lip sync effect based on audio amplitude
      if (analyser && sound.isPlaying) {
          const data = analyser.getAverageFrequency();
          const mouthOpenAmount = data / 256; // Normalize to [0, 1] range

          if (jawBone) {
              jawBone.rotation.x = -0.2 - mouthOpenAmount * 0.2; // Adjust jaw rotation
          }
      } else if (jawBone) {
          // Reset jaw to closed position when audio stops
          jawBone.rotation.x = 0;
      }

      renderer.render(scene, camera);
  }

  animate();
}


// Function to handle audio upload
function handleAudioUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(e.target.result, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(0.5);

        analyser = new THREE.AudioAnalyser(sound, 32);

        // Play audio and animation
        if (TalkAction) {
          TalkAction.reset().play();
        }
        sound.play();

        // When audio finishes, reset avatar to attention position
        sound.onEnded = resetToAttentionPosition;
      });
    };
    reader.readAsDataURL(file);
  }
}

// Function to reset avatar to the original "attention" pose with hands down
function resetToAttentionPosition() {
  if (TalkAction) TalkAction.stop();
  if (jawBone) jawBone.rotation.x = 0; // Reset jaw

  // Reset hands to down position
  if (leftHandBone) {
    leftHandBone.rotation.set(0, 0, 0); // Adjust as needed for natural "down" position
  }
  if (rightHandBone) {
    rightHandBone.rotation.set(0, 0, 0); // Adjust as needed for natural "down" position
  }
}