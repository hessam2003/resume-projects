const nodeHtml = {
    slides: document.querySelectorAll(".circle"),
    prevBtn: document.querySelector("#prevBtn"),
    nextBtn: document.querySelector("#nextBtn"),
    index: 0,
    lines: document.querySelectorAll(".horizontal-line"),
    txt: document.querySelectorAll(".circle__inner-text"),
};

const funcE = {
    event: () => {
        nodeHtml.prevBtn.addEventListener("click", funcE.backward);
        nodeHtml.nextBtn.addEventListener("click", funcE.forward);
    },
    backward: () => {
        if (nodeHtml.index > 0) {
            nodeHtml.index -= 1;
            nodeHtml.nextBtn.disabled = false;
            nodeHtml.nextBtn.classList = "btn--active";
            funcE.activeSlide();
        }
        if (nodeHtml.index === 0) {
            nodeHtml.prevBtn.disabled = true;
            nodeHtml.prevBtn.classList = "btn--disabled";
        }
    },
    forward: () => {
        if (nodeHtml.index < nodeHtml.slides.length - 1) {
            nodeHtml.index += 1;
            nodeHtml.prevBtn.classList = "btn--active";
            funcE.activeSlide();
            nodeHtml.prevBtn.disabled = false;
        }
        if (nodeHtml.index === nodeHtml.slides.length - 1) {
            nodeHtml.nextBtn.disabled = true;
            nodeHtml.nextBtn.classList = "btn--disabled";
        }
    },
    activeSlide: () => {
        for (let i = 0; i < nodeHtml.slides.length; i++) {
            if (i === nodeHtml.index) {
                nodeHtml.slides[i].setAttribute("stroke", "blue");
                nodeHtml.txt[i].setAttribute("fill", "blue");
                if (i > 0) {
                    nodeHtml.lines[i - 1].classList = "hr--active";
                }
            } else if (i > nodeHtml.index) {
                nodeHtml.slides[i].setAttribute("stroke", "gray");
                nodeHtml.lines[i - 1].className = "horizontal-line";
                nodeHtml.txt[i].setAttribute("fill", "gray");
                nodeHtml.txt[i].className = "circle__inner-text";
            }
        }
    },
};

funcE.event();
funcE.activeSlide();

