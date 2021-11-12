async function onLoad() {
    var colors = {
        "oryx": [
            "rgb(49, 46, 46)",
            "rgb(111,104,104)"
        ],
        "realmclearing": [
            "rgb(184,102,12)",
            "rgb(241,141,31)"
        ],
        "void": [
            "rgb(141,81,255)",
            "rgb(167,120,255)"
        ],
        "cult": [
            "rgb(255,36,41)",
            "rgb(255,85,89)"
        ]
    }

    var runs;
    await fetch("./assets/js/dummyDB.json").then(res => res.json()).then(data => runs = data.runs);

    var runsBoard = document.getElementById("raidsBoard");
    var realmsBoard = document.getElementById("realmclearingBoard");

    var started = [];
    var seperator = document.createElement("div");
    seperator.classList.add("seperator");

    for (i in runs) {

        var runLi = document.createElement("li");
        runLi.classList.add("run");
        var progressbarDiv = document.createElement("div");
        progressbarDiv.classList.add("progressbar", runs[i].type, runs[i].started ? "started" : "starting");
        var titleSpan = document.createElement("span");
        titleSpan.classList.add("title");
        titleSpan.innerHTML = runs[i].title + (runs[i].type === "realmclearing" ? " with " : " by ") + runs[i].leader;
        var playersSpan = document.createElement("span");
        playersSpan.classList.add("players");
        playersSpan.innerHTML = (runs[i].started ? new Date(new Date().getTime() - new Date(runs[i].startTime).getTime()) /*.toLocaleTimeString().split(" ")[0]*/ : runs[i].players + "/" + runs[i].maxPlayers);

        progressbarDiv.appendChild(titleSpan);
        progressbarDiv.appendChild(playersSpan);

        runLi.appendChild(progressbarDiv);


        if (runs[i].type === "realmclearing") {
            realmsBoard.appendChild(runLi);
        } else {
            if (runs[i].started) started.push(runLi);
            else runsBoard.appendChild(runLi);
        }
    }

    if (started.length > 0) {
        runsBoard.appendChild(seperator);
        for (i in started) {
            runsBoard.appendChild(started[i]);
        }
    }

    for (i in document.getElementsByClassName("progressbar")) {
        if (!isNaN(i)) {
            var el = document.getElementsByClassName("progressbar")[i];
            if (el.classList.contains("starting")) {
                var percentageArray = el.children[1].innerHTML.split("/")
                var percentage = (parseInt(percentageArray[0]) / parseInt(percentageArray[1])) * 100;
                el.style.background = "linear-gradient(to right, " + colors[el.classList[1]][0] + percentage + "%, " + colors[el.classList[1]][1] + " " + percentage + "%)";
            }
        }
    }

    setRunes();
}

function runeCheck(el) {
    if (el.classList.contains("clicked")) {
        el.classList.remove("clicked");
        if (window.localStorage.getItem(el.children[1].id) == null) {
            window.localStorage.setItem(el.children[1].id, 0);
            el.children[1].innerHTML = 0;
        } else {
            var amount = parseInt(window.localStorage.getItem(el.children[1].id));
            console.log(el.children[1].id + ": " + amount);
            amount--;
            el.children[1].innerHTML = amount;
            window.localStorage.setItem(el.children[1].id, amount);
        }
    } else {
        el.classList.add("clicked")
        if (window.localStorage.getItem(el.children[1].id) == null) {
            window.localStorage.setItem(el.children[1].id, 1);
            el.children[1].innerHTML = 1;
        } else {
            var amount = parseInt(window.localStorage.getItem(el.children[1].id));
            amount++;
            el.children[1].innerHTML = amount;
            window.localStorage.setItem(el.children[1].id, amount);
        }
    }
}

function setRunes() {
    for (i in document.getElementsByClassName("runeCheckButton")) {
        if (document.getElementsByClassName("runeCheckButton")[i] === undefined || document.getElementsByClassName("runeCheckButton")[i].children === undefined) return;
        if (window.localStorage.getItem(document.getElementsByClassName("runeCheckButton")[i].children[1].id) === null) {
            window.localStorage.setItem(document.getElementsByClassName("runeCheckButton")[i].children[1].id, 0)
        }
        document.getElementsByClassName("runeCheckButton")[i].children[1].innerHTML = window.localStorage.getItem(document.getElementsByClassName("runeCheckButton")[i].children[1].id)
    }
}