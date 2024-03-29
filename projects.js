
var projects;
let researchTags = []
let retexsOrder;
window.onload = async function() {
    projects = await getProjects()
    retexsOrder = Object.entries(projects).sort(() => Math.random() - 0.5);
    drawProjects()
}

function drawProjects(){
    document.getElementById("retexs").innerHTML = ""
    retexsOrder.forEach(retex => {
        if(!haveTag(retex[1].tags)) return 
        let tags = ""
        retex[1].tags.forEach(tag => {
            tags+=`<button class="tag" onclick="clickTag('${tag}')">${tag}</button>`
        });
        document.getElementById("retexs").innerHTML += toDisplayableRetex(retex[0], retex[1].title,retex[1].description, tags, retex[1].date)
    })
}


function clickTag(tag){
    addTag(tag)
    searchTagBarChange()
}

function haveTag(tags){
    let res = true
    researchTags.forEach(t => {
        if (!tags.includes(t)){
            res = false;
            return false;
        }
    });
    return res;
}

function removeTag(tag){
    var i = researchTags.indexOf(tag)
    researchTags.splice(i, 1)
    const node = document.getElementById("tag_"+tag)
    node.parentNode.removeChild(node);
    drawProjects()
}
function addTag(searchVal){
    if (researchTags.includes(searchVal))return 
    document.getElementById("searchTag").innerHTML = `
    <div class="tag" id="tag_${searchVal}" >${searchVal}<img src="./img/close.svg" onclick="removeTag('${searchVal}')"></img></div>` + document.getElementById("searchTag").innerHTML
    researchTags.push(searchVal)
    document.getElementById("searchTagBar").value = ""
}
function searchTagBarChange(){
    let searchVal = document.getElementById("searchTagBar").value
    searchVal=searchVal.toLowerCase()
    let lowTags = possibleTags.map(el => el.toLowerCase())
    if (researchTags.includes(searchVal))return 
    let index = lowTags.indexOf(searchVal)
    console.log(index)
    if (index != -1){
        addTag(possibleTags[index])
    }
    drawProjects()
}