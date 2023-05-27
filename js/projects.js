let researchTags = []
function drawProjects(){
    document.getElementById("retexs").innerHTML = ""
    Object.entries(data).forEach(retex => {
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
    document.getElementById("searchTagBar").value += tag
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

function searchTagBarChange(){
    let searchVals = document.getElementById("searchTagBar").value.split(" ")
    searchVals.forEach(searchVal => {
        if (researchTags.includes(searchVal))return 
        if (possibleTags.includes(searchVal)){
            document.getElementById("searchTag").innerHTML = `
            <div class="searchedTag"  id="tag_${searchVal}" >${searchVal}<button onclick="removeTag('${searchVal}')">x</button></div>` + document.getElementById("searchTag").innerHTML
            researchTags.push(searchVal)
        }
    });
    document.getElementById("searchTagBar").value = ""
    drawProjects()
}
drawProjects()