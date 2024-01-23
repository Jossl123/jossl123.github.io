let projects;
window.onload = async function() {
    projects = await getProjects()
    let i = 0;
    Object.entries(projects).slice(0,5).forEach(retex => {
        document.getElementById(`retex_${i}`).innerHTML += toDisplayableRetex(retex[0], retex[1].title,retex[1].description, [], retex[1].date);
        i++;
    })
    window.scrollTo(0, 0)
    document.getElementsByTagName("main")[0].style.marginBottom = window.innerHeight - document.getElementsByTagName("main")[0].offsetHeight + "px"
}

//3D bulb
noise.seed(Math.random());
let scrollx = 0;
let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setClearColor(0x7b7b7b);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let update = function() {
    let time = performance.now() * 0.003;
    for (let i = 0; i < vertices.length; i += 3) {
        let x = sphere.geometry.attributes.position.array[i];
        let y = sphere.geometry.attributes.position.array[i + 1];
        let z = sphere.geometry.attributes.position.array[i + 2];

        // Normalize the vector
        let length = Math.sqrt(x * x + y * y + z * z);
        let nx = x / length;
        let ny = y / length;
        let nz = z / length;

        let n = 1+0.5 + 0.3 * noise.simplex3(nx * k + time/10, ny * k, nz * k);

        // Apply the noise to the normalized vector
        sphere.geometry.attributes.position.array[i] = nx *n;
        sphere.geometry.attributes.position.array[i + 1] =ny *n;
        sphere.geometry.attributes.position.array[i + 2] = nz *n;
    }

    // Inform Three.js that the buffer data has changed
    sphere.geometry.attributes.position.needsUpdate = true;
};

let sphere_geometry = new THREE.SphereGeometry(1, 128, 128);
let material = new THREE.MeshNormalMaterial();

let sphere = new THREE.Mesh(sphere_geometry, material);
scene.add(sphere);


let vertices = sphere.geometry.attributes.position.array;
let k = 2
let time = performance.now() * 0.003;
for (let i = 0; i < vertices.length; i = i + 3) {
    let vector = [sphere.geometry.attributes.position.array[i], vertices[i + 1], vertices[i + 2]]
    let x = sphere.geometry.attributes.position.array[i]
    let y = sphere.geometry.attributes.position.array[i + 1]
    let z = sphere.geometry.attributes.position.array[i + 2]
    let n = 0.5 + 0.3 * noise.simplex3(x * k + time, y * k, z * k)
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
    update()
    resizeCanvasToDisplaySize();
    /* render scene and camera */
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

window.addEventListener("scroll", (e) => {
    scrollx = window.pageYOffset || document.documentElement.scrollTop
    let compDiv = document.getElementById("competitions");
    let canvas = document.getElementById("canvas");
    let ratio = 3
    let top = Math.min(100*ratio,Math.max(0,-compDiv.getBoundingClientRect().top))/ratio
    let transX = (100-top) - 50
    canvas.style.transform = `translateX(${transX}%)`;
})

requestAnimationFrame(animate);

