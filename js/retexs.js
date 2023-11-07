let possibleTags = ["Javascript", "3d", "Java", "SQL", "Python", "C#", "AI", "Bash", "Management", "Physics"]
let data = {
    "rayTracing3d": {
        "title": "Ray Tracing 3d",
        "description": "    This project is a 3d engine made from scratch (with p5 for the vector classes). <br><br>Raytracing rendering method consist of simulating the inverse of a light ray. In the real life the light comme from the light source to our eyes and in raycsating we launch the ray from the eye to the lights sources.<br><br> We 'launch', for every pixel in the screen, ray (represented by a vector) in a 3d world (represented by some object and their properties like their color). We then found what color did the ray touch (go check out the raymarching project) and color the pixel like so. <br><br> This is just a starting point but if you're insterested go checkout <a href='https://www.youtube.com/watch?v=Qz0KTGYJtUk' target='_blank'>Sebastian Lague videos</a> on the subject : ",
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
        "description": "A website to play tetris in multiplayer. Thank to <a href='https://busybox11.github.io/portfolio.html'target='_blank'>busybox</a> for the front.",
        "method": "Nodejs : websocket and express js",
        "skills": "- Javascript <br>- websockets",
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
        "description": "This is a simulation of jelly shapes jumping around. I wanted to code some spring joint physic so there it is",
        "method": "Spring joint physic",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript", "Physics"]
    },
    "MLU": {
        "title": "MLU",
        "description": "A website to explore the Max Litterature Universe",
        "method": "Image mapping",
        "skills": "- Javascript",
        "link": "https://jossl123.github.io/MLU",
        "tags": ["Javascript"]
    },
    "transistoshare": {
        "title": "Transistoshare",
        "description": "A website to simulate some operand gates",
        "method": "Reverse polish notation",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "rayMarching": {
        "title": "Raymarching",
        "description": "This is an implementation of ray marching algorithm. This algorithm is used to get the distance to the closest object from a position to a precise direction",
        "method": "Ray marching",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "mandlebrot2": {
        "title": "Mandlebrot",
        "description": "The mandlebrot fractal made when I was messing around with gpu.js",
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
        "method": "Javascript",
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
        "method": "Nothing particular",
        "skills": "- Javascript",
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
    "doublePendular": {
        "title": "Double pendular",
        "description": "A double pendular balancing back in force",
        "method": "Double Pendular physics",
        "skills": "- Javascript <br>- Math knowledges",
        "tags": ["Javascript"]
    },
    "rsk": {
        "title": "Robot-Socker-Kit",
        "description": "This is a robot competition where you have to code AI for 2 football players in your team to play against other people. With <a href='https://nuno-moreira-ribeiro.github.io/portfolio/' target='_blank'>Nuno Moreira</a> we won the France tournament",
        "method": "A lot of differents stragies to put the ball in the opponent goal",
        "skills": "- AI developpement<br>- Math knowledges",
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
    "sql": {
        "title": "SQL Database developpement",
        "description": "The goal of this project was to create a SQL database for a concert ticket seller website, from the conceptual data model to the concreate SQL script database generation and completion",
        "method": "The conceptual data model was made on Win Design and the script on Microsoft SQL Server",
        "skills": "- SQL<br>- Conceptual data model",
        "tags": ["SQL"]
    },
    "delpeyrat": {
        "title": "Delpeyrat analysis",
        "description": "The goal of this project was to produce a report presenting an organization (here Delpeyrat), an analysis of its macro-environment (PESTEL) and then its microenvironment (PORTER extended competition model)",
        "method": "PORTER and PESTEL analysis technics",
        "skills": "- Manage group project<br>- Analys an organization",
        "tags": ["Management"]
    },
    "postInstallation": {
        "title": "VMWare post installation",
        "description": "The point of this project was to setup a post under Linux to code game in Go",
        "method": "VMWare machine",
        "skills": "- Custom bash Prompt<br>- Setup user post",
        "tags": ["Bash"]
    },
    "bashBlog": {
        "title": "Bash scripting",
        "description": "The goal of this project was to code a blog like command line script where you can edit post, see the previous blog posts, ...",
        "method": "Terminal commands and bash scripts",
        "skills": "- Bash scripting",
        "tags": ["Bash"]
    },
    "odomo": {
        "title": "Odomo",
        "description": "This is a simulation of a domotique central where you can see wheater, temperature and others things. I coded the display part",
        "method": "Matrice calculation and Tests",
        "skills": "- Java <br>- Testing project",
        "tags": ["Java"]
    },
    "biosphere": {
        "title": "Biosphere",
        "description": "The objective of this project was to calculate the possible actions of a game given to us, consisting of planting plants, cutting them, fertilizers, etc., in order to have the most points. In the second part, we had to develop an AI. So I programmed the min max algorithm by optimizing it as much as possible.",
        "method": "Min-max algorithm",
        "skills": "- AI developpement<br>- Find winning strategies ",
        "tags": ["Java", "AI"]
    },
    //sae2
    "hyperstellar": {
        "title": "Hyperstellar",
        "description": "This is a game made with .NET in C# in Visual Studio, it is a board like game, where you can go to differents places to draw cards, victory points and other actions, it was really funny to make.",
        "method": "UML diagram pre-work and C# coding",
        "skills": "- C# developpement<br>- Code dynamic UI transitions<br>- Visual Studio",
        "tags": ["C#"]
    },
    "fluid": {
        "title": "Fluid field",
        "description": "Fluid field representation",
        "method": "Fluid field",
        "skills": "Vector calculation",
        "tags": ["Javascript"]
    },
}