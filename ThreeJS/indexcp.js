// forked from FumioNonaka's "three.js r84: Rotating a cube" http://jsdo.it/FumioNonaka/qdUT

//候補位置FF0040
//何もないFACC2E
var width = 1000;//window.innerWidth;
var height = 1000;//window.innerHeight;
var side = 5;
var scene;
var camera;
var renderer;
var controls;
var cube = [];
var N = 8;
var _camera_r = 60;
var _camera_phi = 60;
var _camera_theta = 40;



function init() {
  scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(100, width / height, 1, 1000);
	controls = new THREE.OrbitControls(camera);
  controls.autoRotate = true;
  renderer = createRenderer(width, height);
	for(var i = 0; i < N; i++){
    cube[i] = [];
    for(var j = 0; j < N; j++){
      cube[i][j] = [];
        for(var k = 0; k < N; k++){
          cube[i][j][k] = createCube(side, side, side, 0xFF0040, (-N/2)*10+k*10+10, (-N/2)*10+j*10+10, (-N/2)*10+i*10+10);
          //scene.add(cube[i][j][k]);
        };
    };
  };
	var light1 = createLight(0xFFFFFF, -1000, 2000, -1000);
	var light2 = createLight(0xFFFFFF, 1000, 2000, 1000);
	camera.position.x = 100;
  camera.position.y = 100;
	camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(light1);
  scene.add(light2);
	update();
}



function createRenderer(width, height) {
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	renderer.setClearColor(0x2EFE2E, 1);
  document.body.appendChild(renderer.domElement);
	return renderer;
}



function createCube(width, height, depth, color, x, y, z) {
	var geometry = new THREE.BoxGeometry(width, height, depth);
	var material = new THREE.MeshPhongMaterial({color: color});
	var cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);
  scene.add(cube);
	return cube;
}



function createLight(color, x, y, z) {
	var light = new THREE.DirectionalLight(color);
	light.position.set(x, y, z);
	return light;
}



function update() {
  controls.update();
  requestAnimationFrame(update);
	renderer.render(scene, camera);
}



window.addEventListener('DOMContentLoaded', init);
