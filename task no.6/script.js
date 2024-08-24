const nodeHtml = {
    numBtn: document.querySelectorAll(".num"),
    powerBtn: document.getElementById("powerBtn"),
    enterNum: document.getElementById("enterNum"),
    enterProcess: document.getElementById("enterProcess"),
    enterResult: document.getElementById("enterResult"),
    process: document.querySelectorAll(".process"),
    result: document.getElementById("result"),
    errorMessage: document.getElementById("errorHandler"),
    deletBtn: document.getElementById("clearBtn"),
    nightMode: document.getElementById("nightModeIcon"),
    keys: document.querySelectorAll(".key"),
    calculator: document.getElementById("calculator"),
    KeyBoard: document.getElementById("KeyBoard"),
    informations: document.querySelectorAll(".info"),
    checkBox: document.getElementById("checkBox"),
    circle: document.getElementById("circle"),
    label: document.getElementById("NeedInfoBtn"),
    infoBox: document.getElementById("infoBox"),
    doubleTheme: document.getElementById("doubleTheme"),
}

const funcE = {
    eventE: () => {
        var powerState = false;
        var nightState = false;
        nodeHtml.label.addEventListener("click", funcE.activate);
        nodeHtml.informations.forEach((el) => {
            el.style.display = "none"
        });
        nodeHtml.numBtn.forEach((el, index) => {
            el.addEventListener("click", () => {
                if (powerState) {
                    var num = el.innerHTML;
                    funcE.showNum(num);
                    nodeHtml.enterResult.classList.remove("color--green")
                    nodeHtml.errorMessage.innerHTML = " ";
                }
            });
        });
        nodeHtml.process.forEach((el, index) => {
            el.addEventListener("click", () => {
                if (powerState && (nodeHtml.enterNum !== "" || nodeHtml.enterResult !== "")) {
                    var data = nodeHtml.enterResult.innerHTML;
                    var opp = el.innerHTML;
                    if (nodeHtml.enterProcess.innerHTML !== "") {
                        funcE.showProcess(opp);
                    } else {
                        funcE.transfer(data);
                        funcE.showProcess(opp);
                    }
                }
            });
        });
        nodeHtml.result.addEventListener("click", () => {
            if (powerState && nodeHtml.enterNum.innerHTML !== "" && nodeHtml.enterResult.innerHTML !== "") {
                funcE.calculate();
                nodeHtml.enterResult.classList.add("color--green")
            }
        });
        nodeHtml.deletBtn.addEventListener("click", () => {
            if (powerState) {
                funcE.eraser();
            }
        });
        nodeHtml.errorMessage.innerHTML = "Power off";
        nodeHtml.powerBtn.addEventListener("click", () => {
            powerState = !powerState;
            if (powerState) {
                nodeHtml.errorMessage.innerHTML = "";
            } else {
                nodeHtml.enterNum.innerHTML = "";
                nodeHtml.enterProcess.innerHTML = "";
                nodeHtml.enterResult.innerHTML = "";
                nodeHtml.errorMessage.innerHTML = "Power off";
            }
        });
        nodeHtml.nightMode.addEventListener("click", funcE.changeState)
    },
    showNum: (num) => {
        nodeHtml.enterResult.innerHTML += num;
    },
    transfer: (data) => {
        if (nodeHtml.enterResult.innerHTML != "") {
            nodeHtml.enterNum.innerHTML = data;
            nodeHtml.enterResult.innerHTML = "";
        }
    },
    showProcess: (opp) => {
        if (nodeHtml.enterNum.innerHTML == "" && nodeHtml.enterResult.innerHTML == "") {
            nodeHtml.errorMessage.innerHTML = "first enter the numbers"
        } else {
            nodeHtml.enterProcess.innerHTML = opp;
        }
    },
    calculate: () => {
        var firstNum = parseFloat(nodeHtml.enterNum.innerHTML);
        var secondNum = parseFloat(nodeHtml.enterResult.innerHTML);
        var progress = nodeHtml.enterProcess.innerHTML;
        var result;
        switch (progress) {
            case "*":
                result = firstNum * secondNum;
                break;
            case "/":
                result = firstNum / secondNum;
                break;
            case "+":
                result = firstNum + secondNum;
                break;
            case "-":
                result = firstNum - secondNum;
                break;
            case "%":
                result = firstNum % secondNum;
                break;
        }
        funcE.erorrHandle(result);

    },
    erorrHandle: (result) => {
        let firstNum = nodeHtml.enterNum;
        let secondNum = nodeHtml.enterResult;
        let progress = nodeHtml.enterProcess;
        let showMessage = nodeHtml.errorMessage;
        if (!isFinite(result)) {
            showMessage.innerHTML = "Error: Cannot process unvalid!";
            firstNum.innerHTML = "";
            secondNum.innerHTML = "";
            progress.innerHTML = "";
        }
        else {
            nodeHtml.enterResult.innerHTML = result;
            nodeHtml.enterNum.innerHTML = "";
            nodeHtml.enterProcess.innerHTML = "";

        }


    },
    eraser: () => {
        if (nodeHtml.enterResult.innerHTML !== "") {
            nodeHtml.enterResult.innerHTML = ""
        }
        else {
            if (nodeHtml.enterNum.innerHTML !== "") {
                nodeHtml.enterNum.innerHTML = ""
            }
            else {
                nodeHtml.enterProcess.innerHTML = ""
            }
        }
    },
    changeState: () => {
        funcE.eventE.nightState = !funcE.eventE.nightState;
        if (funcE.eventE.nightState) {

            nodeHtml.nightMode.setAttribute("src", "photos/dayMode.svg");
            nodeHtml.doubleTheme.classList.add("nightMode")
        }
        else {
            nodeHtml.nightMode.setAttribute("src", "photos/nightMode.svg");
            nodeHtml.doubleTheme.classList.remove("nightMode")
        }
    },
    interval: () => {
        nodeHtml.informations.forEach((el) => {
            el.style.display = "none"
        })
        setInterval(() => {
            var activeIndex = 0;
            if (nodeHtml.checkBox.checked) {
                nodeHtml.infoBox.innerHTML = " ";
                nodeHtml.informations.forEach((el, index) => {
                    el.classList.remove("info--center", "info--bellow", "info--disabled");
                    el.style.display = "block";
                    if (activeIndex === index) {
                        el.classList.add("info--center");
                        if (nodeHtml.nightMode) {
                            el.classList.add("info--center--nightMode")
                        }
                    } else if (index === (activeIndex + 2) % nodeHtml.informations.length) {
                        el.classList.add("info--disabled");
                    } else if (index === (activeIndex + 1) % nodeHtml.informations.length) {
                        el.classList.add("info--top");
                    } else if (index === (activeIndex + 3) % nodeHtml.informations.length) {
                        el.classList.add("info--bellow");
                    }
                });
                activeIndex = (activeIndex + 1) % nodeHtml.informations.length;
            }
        }, 5000);

    },
    activate: () => {
        nodeHtml.infoBox.innerHTML = " ";
        if (nodeHtml.checkBox.checked) {
            nodeHtml.infoBox.innerHTML = "loading ...";
            nodeHtml.informations.forEach((el) => {
                el.style.display = "none"
            })
            nodeHtml.circle.classList.add("innertext__circle--enabled");
            nodeHtml.label.classList.add("label--enabled");
        } else {
            nodeHtml.circle.classList.remove("innertext__circle--enabled");
            nodeHtml.label.classList.remove("label--enabled");
        }
    },
}
funcE.eventE();
funcE.interval();