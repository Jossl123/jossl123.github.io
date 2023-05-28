let researchTags = []
let retexsOrder = Object.entries(data).sort(() => Math.random() - 0.5);
function drawProjects(){
    document.getElementById("retexs").innerHTML = ""
    retexsOrder.forEach(retex => {
        if(!haveTag(retex[1].tags)) return 
        let tags = ""
        retex[1].tags.forEach(tag => {
            tags+=`<button class="tag" onclick="clickTag('${tag}')">${tag}</button>`
        });
        var button = `<div id="${retex[0]}" class="retexBut" style="background: url('./img/pp/${retex[0]}.png')">${tags}</div>`
        document.getElementById("retexs").innerHTML += button
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
    if (researchTags.includes(searchVal))return 
    if (possibleTags.includes(searchVal))addTag(searchVal)
    drawProjects()
}
drawProjects()