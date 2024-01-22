var projects;
window.onload = async function() {
    projects = await getProjects()
    let i = 0;
    Object.entries(projects).slice(0,5).forEach(retex => {
        document.getElementById(`retex_${i}`).innerHTML += toDisplayableRetex(retex[0], retex[1].title,retex[1].description);
        i++;
    })
    window.scrollTo(0, 0)
    document.getElementsByTagName("main")[0].style.marginBottom = window.innerHeight - document.getElementsByTagName("main")[0].offsetHeight + "px"
}
function hideRetex() {
    document.getElementById("visibleRetex").parentNode.removeChild(document.getElementById("visibleRetex"))
    start3d()
}


//3D bulb
noise.seed(Math.random());
var scrollx = 0;
var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setClearColor(0x7b7b7b);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;


var sphere_geometry = new THREE.SphereGeometry(1, 128, 128);
var material = new THREE.MeshNormalMaterial();

var sphere = new THREE.Mesh(sphere_geometry, material);
scene.add(sphere);


var vertices = sphere.geometry.attributes.position.array;
var k = 2
var time = performance.now() * 0.003;
for (let i = 0; i < vertices.length; i = i + 3) {
    var vector = [sphere.geometry.attributes.position.array[i], vertices[i + 1], vertices[i + 2]]
    var x = sphere.geometry.attributes.position.array[i]
    var y = sphere.geometry.attributes.position.array[i + 1]
    var z = sphere.geometry.attributes.position.array[i + 2]
    var n = 0.5 + 0.3 * noise.simplex3(x * k + time, y * k, z * k)
    sphere.geometry.attributes.position.array[i] *= n + 1
    sphere.geometry.attributes.position.array[i + 1] *= n + 1
    sphere.geometry.attributes.position.array[i + 2] *= n + 1
}

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}
function animate() {
    sphere.rotation.x = scrollx * 0.005;
    resizeCanvasToDisplaySize();
    /* render scene and camera */
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

window.addEventListener("scroll", (e) => {
    scrollx = window.pageYOffset || document.documentElement.scrollTop
})

requestAnimationFrame(animate);

