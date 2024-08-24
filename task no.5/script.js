const nodeHtml = {
    chevronDown: document.querySelectorAll(".icon--open"),
    closeBtn: document.querySelectorAll(".icon--close"),
    answers: document.querySelectorAll(".answer--disabled"),
    sheet: document.querySelectorAll(".main__sheet--close"),
}
const funcE = {
    eventE: () => {
        nodeHtml.chevronDown.forEach((el, index) => {
            el.addEventListener("click", () => funcE.showAnswer(index));
        });
        nodeHtml.closeBtn.forEach((el, index) => {
            el.addEventListener("click", () => funcE.closeAnswer(index));
        });


    },
    showAnswer: (index) => {
        nodeHtml.chevronDown[index].classList.add("disabled");
        nodeHtml.closeBtn[index].classList.add("enabled");
        nodeHtml.answers[index].classList.add("answer--enabled");
        nodeHtml.sheet[index].classList.add("main__sheet--open");
    },
    closeAnswer: (index) => {
        nodeHtml.chevronDown[index].classList.remove("disabled");
        nodeHtml.closeBtn[index].classList.remove("enabled");
        nodeHtml.answers[index].classList.remove("answer--enabled");
        nodeHtml.sheet[index].classList.remove("main__sheet--open");

    }
}
funcE.eventE()