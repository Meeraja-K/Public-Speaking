import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Load the model when the window is fully loaded
window.onload = () => loadModel();

let sound, mixer, TalkAction, analyser, jawBone, leftHandBone, rightHandBone;

// Function to load the 3D model of the avatar
function loadModel() {
  const loader = new GLTFLoader();
  loader.load('avatar.glb',
    (gltf) => {
      setupScene(gltf); // Setup the scene with the loaded model
      document.getElementById('avatar-loading').style.display = 'none'; // Hide loading message
    },
    (xhr) => {
      // Update loading progress
      const percentCompletion = Math.round((xhr.loaded / xhr.total) * 100);
      document.getElementById('avatar-loading').innerText = `LOADING... ${percentCompletion}%`; // Fixed template literal
      console.log(`Loading model... ${percentCompletion}%`); // Fixed template literal
    },
    (error) => {
      console.error(error); // Log any loading errors
    }
  );
}

// Function to set up the 3D scene, including renderer, camera, lights, and the avatar
function setupScene(gltf) {
  // Create a WebGL renderer and configure it
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const container = document.getElementById('avatar-container');
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement); // Add the renderer to the DOM

  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight);
  camera.position.set(0.2, 0.5, 1); // Set initial camera position

  // Orbit controls for camera movement
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Smooth movement
  controls.enablePan = false; // Disable panning
  controls.enableZoom = false; // Disable zooming
  controls.minDistance = 3; // Minimum distance for zoom
  controls.minPolarAngle = 1.4; // Limit vertical rotation
  controls.maxPolarAngle = 1.4; // Limit vertical rotation
  controls.target = new THREE.Vector3(0, 0.75, 0); // Center point for controls
  controls.update();

  // Scene setup
  const scene = new THREE.Scene();

  // Lighting setup
  scene.add(new THREE.AmbientLight());

  // Create and add a spotlight
  const spotlight = new THREE.SpotLight(0xffffff, 20, 8, 1);
  spotlight.penumbra = 0.5; // Soft edges for the spotlight
  spotlight.position.set(0, 4, 2); // Position the spotlight
  spotlight.castShadow = true; // Enable shadows
  scene.add(spotlight); // Add spotlight to the scene

  // Create and add a directional light
  const keyLight = new THREE.DirectionalLight(0xffffff, 2);
  keyLight.position.set(1, 1, 2); // Position the directional light
  keyLight.lookAt(new THREE.Vector3()); // Point the light at the origin
  scene.add(keyLight); // Add directional light to the scene

  // Load avatar and find the jaw and hand bones
  const avatar = gltf.scene;
  avatar.traverse((child) => {
      if (child.isMesh) {
          child.castShadow = true; // Enable shadow casting
          child.receiveShadow = true; // Enable shadow receiving
      }
      if (child.name === "Jaw") {
          jawBone = child;
      }
      if (child.name === "LeftHand") { 
          leftHandBone = child;
      }
      if (child.name === "RightHand") { 
          rightHandBone = child;
      }
  });
  avatar.position.set(0, -0.8, -0.5); // Position the avatar in the scene
  scene.add(avatar); // Add the avatar to the scene

  // Load animations
  mixer = new THREE.AnimationMixer(avatar);
  const clips = gltf.animations; // Get the animation clips from the loaded model
  const TalkClip = THREE.AnimationClip.findByName(clips, 'Talking'); // Find the 'Talking' animation clip
  TalkAction = mixer.clipAction(TalkClip); // Create an action for the talking animation

  // Set up audio listener and analyser for sound processing
  const listener = new THREE.AudioListener();
  camera.add(listener); // Attach the listener to the camera

  sound = new THREE.Audio(listener); // Create a new audio object
  analyser = new THREE.AudioAnalyser(sound, 32); // Create an analyser for audio frequency data

  // Set up audio file upload handling
  document.getElementById('audio-upload').addEventListener('change', handleAudioUpload); // Listen for audio file uploads

  // Raycaster for interaction
  const raycaster = new THREE.Raycaster();
  container.addEventListener('mousedown', (ev) => {
      const coords = {
          x: (ev.offsetX / container.clientWidth) * 2 - 1, // Normalize x coordinate
          y: -(ev.offsetY / container.clientHeight) * 2 + 1 // Normalize y coordinate
      };
      raycaster.setFromCamera(coords, camera); // Set raycaster from camera
      const intersections = raycaster.intersectObject(avatar); // Check for intersections with the avatar
  });

  // Event listener for reset button
  document.getElementById('reset-button').addEventListener('click', resetToAttentionPosition);

  // Handle window resizing
  window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight; // Update camera aspect ratio
      camera.updateProjectionMatrix(); // Update camera projection matrix
      renderer.setSize(container.clientWidth, container.clientHeight); // Resize renderer
  });

  // Create a clock for animation timing
  const clock = new THREE.Clock();
  function animate() {
      requestAnimationFrame(animate); // Request the next frame

      const delta = clock.getDelta(); // Get the time since the last frame
      mixer.update(delta); // Update the animation mixer

      // Lip sync effect based on audio amplitude
      if (analyser && sound.isPlaying) {
          const data = analyser.getAverageFrequency(); // Get average frequency data
          const mouthOpenAmount = data / 256; // Normalize to [0, 1] range
          if (jawBone) {
              jawBone.rotation.x = -0.2 - mouthOpenAmount * 0.2; // Adjust jaw rotation
          }
      } else if (jawBone) {
          // Reset jaw to closed position when audio stops
          jawBone.rotation.x = 0;
      }
      renderer.render(scene, camera); // Render the scene
  }
  animate(); // Start the animation loop
}

// Function to handle audio upload
function handleAudioUpload(event) {
  const file = event.target.files[0]; // Get the uploaded file
  if (file) {
    const reader = new FileReader(); // Create a file reader
    reader.onload = (e) => {
      const audioLoader = new THREE.AudioLoader(); // Create an audio loader
      audioLoader.load(e.target.result, (buffer) => {
        sound.setBuffer(buffer); // Set the audio buffer
        sound.setLoop(false); // Disable looping
        sound.setVolume(0.5); // Set volume

        analyser = new THREE.AudioAnalyser(sound, 32); // Create a new analyser for the sound

        // Play audio and animation
        if (TalkAction) {
          TalkAction.reset().play(); // Reset and play the talking animation
        }
        sound.play(); // Play the audio

        // When audio finishes, reset avatar to attention position
        sound.onEnded = resetToAttentionPosition;
      });
    };
    reader.readAsDataURL(file); // Read the file as a data URL
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
