
var canClose = true

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

function showRetex(e) {
    if (isRetex()) return
    id = e.target.id
    var link = doesFileExist(`./${id}.html`) ? `href="./${id}.html" ` : `href="#"`
    if (data[id].link) link = `href="${data[id].link}"`

    var div = `<div class="retex" id="visibleRetex">
        <button onclick="hideRetex()"><img src="./img/closeIcon.png"></button>
        <div>
            <div><a ${link} target="_blank"><img src="./img/pp/${id}.png" alt=""><p>Click to open</p></a></div>
            <div>
                <h3>${data[id].title}</h3>
                <p>${data[id].description}</p>
            </div>
            <div>
                <h3>Method</h3>
                <p>${data[id].method}</p>
            </div>
            <div>
                <h3>Skills</h3>
                <p>${data[id].skills}</p>
            </div>
        </div>
    </div>`
    document.body.innerHTML += div
    canClose = true
}


document.addEventListener("mousedown", (e) => {
    if (canClose && !e.target.closest("#visibleRetex") && isRetex()) hideRetex()
})

document.addEventListener("touchstart", (e) => {
    beginingx = event.changedTouches[0].clientX
    if (canClose && !e.target.closest("#visibleRetex") && isRetex())hideRetex()
})

function isRetex() {
    var element = document.getElementById("visibleRetex")
    return typeof(element) != 'undefined' && element != null
}



//print retex


function print_retex() {
    var mywindow = window.open("", "PRINT",
        "height=400,width=600");

    let retexs = ""

    let keys = Object.keys(data)
    keys.forEach(id => {
        const retex = data[id]
        var link = doesFileExist(`./${id}.html`) ? `href="./${id}.html" target="_blank"` : `href="#"`
        var div = `<div class="retex" id="visibleRetex">
            <img src="./img/closeIcon.png"></img>   
            <div>
                <div><a ${link}><img src="./img/pp/${id}.png" alt=""></a></div>
                <div>
                    <h3>${retex.title}</h3>
                    <p>${retex.description}</p>
                </div>
                <div>
                    <h3>Method</h3>
                    <p>${retex.method}</p>
                </div>
                <div>
                    <h3>Skills</h3>
                    <p>${retex.skills}</p>
                </div>
            </div>
        </div>`
        retexs += div
    });

    mywindow.document.write(retexs);

    mywindow.document.close();
    mywindow.focus();

    mywindow.print();
    mywindow.close();

    return true;
}