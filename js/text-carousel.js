// Comes from here:
// codepen.io/josephwong2004/pen/ExgoKde

const carouselText = [
    {text: "I'm a software developer and consultant.", color: "navy"},
    {text: "I love functional programming in F#, Typescript, Erlang, Ocaml, Lua.", color: "orange"},
    {text: "I always like to learn new things and share knowledge.", color: "darkred"},
    {text: "I use free and Open Source solutions.", color: "darkgreen"}
]

window.addEventListener('DOMContentLoaded', () => {
    carousel(carouselText, document.querySelector("#feature-text"));
});

async function typeSentence(sentence, elRef, delay = 70) {
    const letters = sentence.split("");
    let i = 0;
    while(i < letters.length) {
        await waitForMs(delay);
        elRef.innerHTML = elRef.innerHTML + letters[i];
        i += 1;
    }
    return;
}

async function deleteSentence(elRef) {
    const sentence = elRef.innerHTML;
    const letters = sentence.split("");
    while(letters.length > 0) {
        await waitForMs(50);
        letters.pop();
        elRef.innerHTML = letters.join("");
    }
}

async function carousel(carouselList, elRef) {
    let i = 0;
    while(true) {
        updateFontColor(elRef, carouselList[i].color)
        await typeSentence(carouselList[i].text, elRef);
        await waitForMs(1500);
        await deleteSentence(elRef);
        await waitForMs(500);
        i += 1;
        if(i >= carouselList.length) {i = 0;}
    }
}

function updateFontColor(elRef, color) {
    elRef.style.color = color;
}

function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}