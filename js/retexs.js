let possibleTags = ["Javascript", "3d", "Java", "SQL", "Python", "C#", "AI", "Bash", "Management", "Physics"]
let data = {
    "rayTracing3d": {
        "title": "Ray Tracing 3d",
        "description": "    This project is a 3d engine made from scratch (with p5 for the vector classes). <br><br>Raytracing rendering method consist of simulating the inverse of a light ray. In the real life the light comme from the light source to our eyes and in raycsating we launch the ray from the eye to the lights sources.<br><br> We 'launch', for every pixel in the screen, ray (represented by a vector) in a 3d world (represented by some object and their properties like their color). We then found what color did the ray touch (go check out the raymarching project) and color the pixel like so. <br><br> This is just a starting point but if you're insterested go checkout <a href='https://www.youtube.com/watch?v=Qz0KTGYJtUk'>Sebastian Lague videos</a> on the subject : ",
        "method": "- ray tracing <br>\
        - ray marching <br>",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript", "3d"]
    },
    "planetGenerator": {
        "title": "Planet generator",
        "description": "Here, you can generate random planets with a specific rezolution and then move around. It was made in the optic of learning how rasterization work. This is a pretty old project but still one of the coolest ones",
        "method": "rasterization",
        "skills": "- Javascript <br>- math and algorithms knowledge improvements",
        "tags": ["Javascript", "3d"]
    },
    "twotris": {
        "title": "Twotris",
        "description": "A website to play tetris in multiplayer. Thank to <a href='https://github.com/busybox11'>busybox</a> for the front.",
        "method": "Nodejs : websocket and express js",
        "skills": "- javascript <br>- websockets",
        "link": "https://twotris.onrender.com",
        "tags": ["Javascript"]
    },
    "rayCasting": {
        "title": "Ray casting",
        "description": "A raycasting website representing the backrooms",
        "method": "ray casting",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript", "3d"]
    },
    "springjoint": {
        "title": "Spring joint",
        "description": "spring joint",
        "method": "physics",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript", "Physics"]
    },
    "MLU": {
        "title": "MLU",
        "description": "A website to explore the Max Litterature Universe",
        "method": "image mapping",
        "skills": "javascript skills",
        "link": "https://jossl123.github.io/MLU",
        "tags": ["Javascript"]
    },
    "transistoshare": {
        "title": "Transistoshare",
        "description": "A website to simulate some operand gates",
        "method": "reverse polish notation",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "rayMarching": {
        "title": "Raymarching",
        "description": "Ray marching simulation",
        "method": "ray marching",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "mandlebrot2": {
        "title": "Mandlebrot",
        "description": "The mandlebrot fractal",
        "method": "gpu.js",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "boids": {
        "title": "Boids",
        "description": "Birds flight simulation, not very realistic but it is what it is",
        "method": "boids method",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "learnPI": {
        "title": "Learn PI",
        "description": "A website to check your PI knowledge",
        "method": "javascript",
        "skills": "- Javascript <br>- PI knowledges",
        "tags": ["Javascript"]
    },
    "quadTree": {
        "title": "QuadTree",
        "description": "Quadtree algorithm visualisation implementation",
        "method": "Quadtree",
        "skills": "- Javascript <br>- QuadTree knowledges",
        "tags": ["Javascript"]
    },
    "beautifulArt": {
        "title": "Circle art",
        "description": "Just playing with visual things",
        "method": "",
        "skills": "",
        "tags": ["Javascript"]
    },
    // "triangleMesh": {
    //     "title": "Triangles movement",
    //     "description": "Visual triangle movements inspired by particule.js",
    //     "method": "",
    //     "skills": "Javascript skills",
    //     "tags": ["Javascript"]
    // },
    "collatzConjecture": {
        "title": "Collatz conjecture viewer",
        "description": "A simple collatz conjecture visualizer",
        "method": "Collatz conjecture",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "doublePendule": {
        "title": "Double pendular",
        "description": "A double pendular balancing back in force",
        "method": "Double Pendular physics",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "rsk": {
        "title": "Robot-Socker-Kit",
        "description": "",
        "method": "",
        "skills": "",
        "tags": ["Python", "AI"],
        "link": "https://robot-soccer-kit.com/"
    },
    // "gamejam": {
    //     "title": "Game jam",
    //     "description": "",
    //     "method": "",
    //     "skills": "time limit",
    //     "tags": ["Python"]
    // },

    //sae
    "odomo": {
        "title": "Odomo",
        "description": "This is a simulation of a domotique central",
        "method": "Matrice calculation and Tests",
        "skills": "Testing project",
        "tags": ["Java"]
    },
    "biosphere": {
        "title": "Biosphere",
        "description": "The objective of this project was to calculate the possible actions of a game given to us, consisting of planting plants, cutting them, fertilizers, etc., in order to have the most points. In the second part, we had to develop an AI. So I programmed the min max algorithm by optimizing it as much as possible.",
        "method": "Min-max algorithm",
        "skills": "AI developpement",
        "tags": ["Java", "AI"]
    },
    //sae2
    "hyperstellar": {
        "title": "Hyperstellar",
        "description": "Game made in C#",
        "method": "",
        "skills": "",
        "tags": ["C#"]
    },
}