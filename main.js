import './style.css';

import * as THREE from 'C:/xampp/htdocs/three-js-project/node_modules/three'; 
import { OrbitControls } from 'C:/xampp/htdocs/three-js-project/node_modules/three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'C:/xampp/htdocs/three-js-project/node_modules/three/examples/jsm/controls/DragControls';
import { GLTFLoader } from 'C:/xampp/htdocs/three-js-project/node_modules/three/examples/jsm/loaders/GLTFLoader'; 

import luffy from './luffy.jpg';
import space from './space1.jpg';
import moon_img from './moon.jpg';
import normal_img from './normal.jpg';
//import dog_obj from './dog.glb';

// 1 -  Define setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(10);

renderer.render(scene, camera);

// 2 - Torus Geometry

const geometry = new THREE.TorusGeometry(15, 3, 16, 100);
//const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
//const material = new THREE.MeshStandardMaterial({ color: 0xff6347});

const torusTexture = new THREE.TextureLoader().load(luffy);

torusTexture.wrapS = THREE.RepeatWrapping;
torusTexture.wrapT = THREE.RepeatWrapping;
torusTexture.repeat.set( 4, 2 );

const material = new THREE.MeshBasicMaterial({ map: torusTexture });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// 4 - Light

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// 5 - Helper (optional)

//const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(/*lightHelper,*/ gridHelper )

// 6 - Orbit Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);    // orbital control

// 7 - Stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
  
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(100));
  
    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

// 8 - Background
const spaceTexture = new THREE.TextureLoader().load(space);
scene.background = spaceTexture;

// 9 -  Avatar
//const avatarTexture = new THREE.TextureLoader().load('avatar.jpg');
//const avatar = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: avatarTexture }));
//scene.add(avatar);

//9 - Moon
const moonTexture = new THREE.TextureLoader().load(moon_img);
const normalTexture = new THREE.TextureLoader().load(normal_img);

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture,
    })
);

moon.position.z = -20;
moon.position.setX(10);
moon.position.setY(20);

scene.add(moon);

// 10 - Voxel DOG

var objects = [];   // object for drag control
let dog;

let loader = new GLTFLoader();
loader.load( 'dog.glb', 
    function ( gltf ) {
        //dog = gltf.scene;
        
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                //child.geometry.center(); // center here              
                objects.push( child );
                dog = child;
            }
        });       
        gltf.scene.scale.set(4,4,4) // scale here       
        scene.add( gltf.scene );       

    }, (xhr) => xhr, ( err ) => console.error( e ));

// Drag Controls
    
objects.push( torus );
objects.push( moon );

const dragControls = new DragControls( objects, camera, renderer.domElement );

// event listener to disable orbitControls while dragging and highlight dragged objects

dragControls.addEventListener( 'dragstart', function ( event ) {
    orbitControls.enabled = false;
	//event.object.material.emissive.set( 0xaaaaaa );   // only to objs made with MeshStandardMaterial, can't use on MeshBasicMaterials
} );

dragControls.addEventListener( 'dragend', function ( event ) {
    orbitControls.enabled = true;
	//event.object.material.emissive.set( 0x000000 );   // only to objs made with MeshStandardMaterial, can't use on MeshBasicMaterials
} );
	

// 3 (final) - Animation Loop
function animate(){
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    moon.rotation.y += 0.005;
  
    dog.rotation.z += 0.005;

    orbitControls.update();  // orbital control
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render();
}

animate();