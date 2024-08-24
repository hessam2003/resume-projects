const nodeHtml = {
    goodBtn: document.getElementById("goodBtn"),
    goodCircle: document.getElementById("goodCircle"),
    checkbox: document.querySelectorAll(".checkbox")[0],
    goodLable: document.getElementById("goodLable"),
};

const funcE = {
    eventE: () => {
        nodeHtml.goodBtn.addEventListener("click", funcE.updateBtn);
        nodeHtml.goodLable.addEventListener("click", funcE.checkBtn);
    },
    checkBtn: () => {
        if (nodeHtml.checkbox.checked) {
            nodeHtml.checkbox.checked = false;
            funcE.updateBtn()
        }
        else {
            nodeHtml.checkbox.checked = true;
            funcE.updateBtn()
        }

    },
    updateBtn: () => {
        if (nodeHtml.checkbox.checked) {
            nodeHtml.goodBtn.className = "label--enabled";
            nodeHtml.goodCircle.classList.add("innertext__circle--enabled");

        } else {
            nodeHtml.goodBtn.className = "label--disabled";
            nodeHtml.goodCircle.classList.remove("innertext__circle--enabled");

        }
    }
};
funcE.eventE();