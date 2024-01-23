
var scrollx=0;
function f(x){return Math.sin(x/1000)}
window.addEventListener("scroll", (e)=>{
    scrollx = window.pageYOffset || document.documentElement.scrollTop
    console.log(scrollx)
    document.getElementById("canvas").style.top = scrollx+"px"
    document.getElementById("canvas").style.left = (f(scrollx)*window.innerWidth)-window.innerWidth/2+"px"
})
noise.seed(Math.random());
var renderer = new THREE.WebGLRenderer({ canvas : document.getElementById('canvas'), antialias:true});
// default bg canvas color //
renderer.setClearColor(0x7b7b7b);
//  use device aspect ratio //
renderer.setPixelRatio(window.devicePixelRatio);
// set size of canvas within window //
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x000000, 0 ); 
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;


var sphere_geometry = new THREE.SphereGeometry(1, 128, 128);
var material = new THREE.MeshNormalMaterial();

var sphere = new THREE.Mesh(sphere_geometry, material);
scene.add(sphere);


var vertices = sphere.geometry.attributes.position.array;
var k = 2
var update = function() {
    var time = performance.now() * 0.003;
    for (let i = 0; i < vertices.length; i += 3) {
        var x = sphere.geometry.attributes.position.array[i];
        var y = sphere.geometry.attributes.position.array[i + 1];
        var z = sphere.geometry.attributes.position.array[i + 2];

        // Normalize the vector
        var length = Math.sqrt(x * x + y * y + z * z);
        var nx = x / length;
        var ny = y / length;
        var nz = z / length;

        var n = 1+0.5 + 0.3 * noise.simplex3(nx * k + time/10, ny * k, nz * k);

        // Apply the noise to the normalized vector
        sphere.geometry.attributes.position.array[i] = nx *n;
        sphere.geometry.attributes.position.array[i + 1] =ny *n;
        sphere.geometry.attributes.position.array[i + 2] = nz *n;
    }

    // Inform Three.js that the buffer data has changed
    sphere.geometry.attributes.position.needsUpdate = true;
};
function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // update any render target sizes here
    }
}

function animate() {
    sphere.rotation.x = scrollx*0.005;
    update()
    resizeCanvasToDisplaySize();
    /* render scene and camera */
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}


requestAnimationFrame(animate);