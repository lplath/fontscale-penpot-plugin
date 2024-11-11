import "./style.css";

import { GenerateTypescaleMessage, PluginMessage, scales, SelectionChangedMessage, ThemeChangedMessage } from "./model";

// Setup theme
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const emptyMessage = document.getElementById("empty-message") as HTMLDivElement;
const form = document.querySelector("form") as HTMLFormElement;
const selector = document.querySelector("select[name='scale']") as HTMLSelectElement;
const customScaleInput = document.getElementById("customScaleInput") as HTMLTemplateElement;

function onPluginMessage(event: MessageEvent<PluginMessage>) {
    if (event.data.type == "themechanged") {
        const message = event.data as ThemeChangedMessage;
        document.body.dataset.theme = message.content
    }
    else if (event.data.type == "selectionchanged") {
        const message = event.data as SelectionChangedMessage
        emptyMessage.classList.toggle("hidden", message.content);
        form.classList.toggle("hidden", !message.content);
    }
}

function onSubmit(event: Event) {
    event.preventDefault();

    const data = new FormData(form);

    const scale = data.get("scale");
    const customScale = data.get("customScale");
    const numSmallerFonts = data.get("numSmallerFonts");
    const numLargerFonts = data.get("numLargerFonts");

    // Should not be allowed by the <form> element
    if (scale == null || numSmallerFonts == null || numLargerFonts == null) {
        throw new Error("Form value was null");
    }

    const message: GenerateTypescaleMessage = {
        type: "generate",
        content: {
            scale: parseInt(scale.toString()),
            customScale: customScale != null ? parseFloat(customScale.toString()) : 0,
            numSmallerFonts: parseInt(numLargerFonts.toString()),
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
    scales.forEach((scale, index) => {
        const option = document.createElement("option");
        option.value = index.toString();
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

// Check if the UI should be shown initially
parent.postMessage(JSON.stringify({ type: "checkselection" }), "*");