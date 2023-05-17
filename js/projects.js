let researchTags = []
function drawProjects(){
    document.getElementById("retexs").innerHTML = ""
    Object.entries(data).forEach(retex => {
        if(!haveTag(retex[1].tags)) return 
        var button = `<button id="${retex[0]}" onclick="showRetex(event)" class="retexBut" style="background: url('./img/pp/${retex[0]}.png');"></button>`
        document.getElementById("retexs").innerHTML += button
    })
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

function searchTag(e){
    let searchVal = document.getElementById("searchTagBar").value
    if (possibleTags.includes(searchVal)){
        document.getElementById("searchTag").innerHTML = `
        <div class="searchedTag"  id="tag_${searchVal}" >${searchVal}<button onclick="removeTag('${searchVal}')">x</button></div>` + document.getElementById("searchTag").innerHTML
        researchTags.push(searchVal)
    }
    drawProjects()
}

drawProjects()