window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
let possibleTags = ["Javascript", "3d", "Java", "SQL", "Python", "C#", "AI", "Bash", "Management", "Physics"]
async function getProjects() {
    return fetch('proj.json')
        .then(response => response.text())
        .then(data => { return JSON.parse(data) });
}

document.addEventListener("mousedown", (e) => {
    console.log(e.target)
    if (detailedRetexShowed && !e.target.closest("#retex_detailed")) hideRetex()
})

var detailedRetexShowed = false;
function showDetailedRetex(retexName){
    detailedRetexShowed = true
    var retex = projects[retexName]
    var link = doesFileExist(`./projects/${retexName}.html`) ? `./projects/${retexName}.html ` : ``
    document.getElementById("retex_detailed_title").innerHTML=retex.title
    document.getElementById("retex_detailed_img").src=`./img/pp/${retexName}.png`
    if (retex.link)document.getElementById("retex_detailed_link").href=retex.link
    else document.getElementById("retex_detailed_link").href=link
    document.getElementById("retex_detailed_desc").innerHTML=retex.description
    document.getElementById("retex_detailed_date").innerHTML=retex.date
    document.getElementById("retex_detailed_method").innerHTML=retex.method
    document.getElementById("retex_detailed_skills").innerHTML=retex.skills

    var detRetDiv = document.getElementById("retex_detailed_zone")
    detRetDiv.classList.add("visible")
    detRetDiv.classList.remove("hidden")
}
function hideRetex() {
    detailedRetexShowed = false
    var detRetDiv = document.getElementById("retex_detailed_zone")
    detRetDiv.classList.remove("visible")
    detRetDiv.classList.add("hidden")
}


function toDisplayableRetex(name, title, description, tags=[], date="12 mai"){
    return `
    <div class="rounded-lg bg-[--dark-gray] flex flex-col scale-100 hover:scale-105 transition-all shadow-xl">
        <div class="absolute p-1 flex gap-2 flex-wrap">${tags}</div>
        <div  onclick="showDetailedRetex('${name}')">
            <img class="rounded-t-lg max-h-64 object-cover" src="./img/pp/${name}.png" alt="">
            <div class="p-6 flex flex-col flex-1">
                <p class="text-white font-bold text-2xl">${title}</p>
                <p class="text-white line-clamp-2">${description}</p>
                <p class="mt-auto mb-0 text-[--gray] font-bold">${date}</p>
            </div>
        </div>
    </div>`
}





function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}