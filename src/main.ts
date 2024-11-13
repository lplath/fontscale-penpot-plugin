import "./style.css";

import type { GenerateTypescaleMessage, PluginMessage, SelectionChangedMessage, ThemeChangedMessage } from "./model";


/**
 * Selection of proportions
 * https://de.wikipedia.org/wiki/Proportion_(Architektur)#Zahlenverh%C3%A4ltnisse
 */
export const scales = [
    { value: 9 / 8, name: "Major Second" },
    { value: 6 / 5, name: "Minor Third" },
    { value: 5 / 4, name: "Major Third" },
    { value: 4 / 3, name: "Perfect Fourth" },
    { value: Math.sqrt(2), name: "Squareroot of 2"},
    { value: 3 / 2, name: "Perfect Fifth" },
    { value: 8 / 5, name: "Minor Sixth" },
    { value: (1 + Math.sqrt(5)) / 2, name: "Golden Ratio" },
    { value: 5 / 3, name: "Major Sixth" },
    { value: Math.sqrt(3), name: "Squareroot of 3"},
    { value: 9 / 5, name: "Minor Seventh" },
    { value: 15 / 8, name: "Major Seventh" },
    { value: 2, name: "Octave" },
]

const emptyMessage = document.getElementById("empty-message") as HTMLDivElement;
const form = document.querySelector("form") as HTMLFormElement;
const selector = document.querySelector("select[name='scale']") as HTMLSelectElement;
const customScaleInput = document.getElementById("customScaleInput") as HTMLTemplateElement;


function changeUiVisibility(visible: boolean) {
    form.classList.toggle("hidden", !visible);
    emptyMessage.classList.toggle("hidden", visible);
}

function onPluginMessage(event: MessageEvent<PluginMessage>) {
    if (event.data.type == "themechanged") {
        const message = event.data as ThemeChangedMessage;
        document.body.dataset.theme = message.content
    }
    else if (event.data.type == "selectionchanged") {
        const message = event.data as SelectionChangedMessage
        changeUiVisibility(message.content);
    }
}

function onSubmit(event: Event) {
    event.preventDefault();

    const data = new FormData(form);
    const scale = data.get("scale");
    const customScale = data.get("customScale");
    const numSmallerFonts = data.get("numSmallerFonts");
    const numLargerFonts = data.get("numLargerFonts");


    // Should not be allowed since all <input> have the 'required' attribute
    if (scale == null || numSmallerFonts == null || numLargerFonts == null) {
        throw new Error("Form value was null");
    }

    const scaleString = customScale != null ? customScale.toString() : scale.toString();

    const message: GenerateTypescaleMessage = {
        type: "generate",
        content: {
            scale: parseFloat(scaleString.replace(",", ".")),
            numSmallerFonts: parseInt(numSmallerFonts.toString()),
            numLargerFonts: parseInt(numLargerFonts.toString())
        }
    }

    parent.postMessage(JSON.stringify(message), "*");
}

function onSelection(event: Event) {
    const target = event.target as HTMLSelectElement;
    const container = customScaleInput.parentNode as HTMLDivElement;
    const content = container.querySelector(".scaleOptions__customInput");

    if (target.value == "-1") {
        if (!content) {
            const clone = customScaleInput.content.cloneNode(true) as DocumentFragment;
            container.appendChild(clone);
        }
    } else {
        if (content) {
            container.removeChild(content);
        }
    }
}

function init() {
    const searchParams = new URLSearchParams(window.location.search);
    const theme = searchParams.get("theme") ?? "light";
    const isUiVisible = searchParams.get("initialState") != "hidden";

    document.body.dataset.theme = theme;
    changeUiVisibility(isUiVisible);
    
    console.log(isUiVisible);

    scales.forEach((scale) => {
        const option = document.createElement("option");
        option.value = scale.value.toString();
        option.innerText =
            `${scale.value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 3 })}  -  ${scale.name}`;
        selector.appendChild(option);
    });

    const custom = document.createElement("option");
    custom.value = "-1";
    custom.innerText = "Custom";
    selector.appendChild(custom);
}

window.addEventListener("message", onPluginMessage);
window.addEventListener("load", init);
form.addEventListener("submit", onSubmit);
selector.addEventListener("change", onSelection);