import "./style.css";

import { PluginMessage, SelectionChangedMessage, ThemeChangedMessage } from "./model";

// Setup theme
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const emptyMessage = document.getElementById("empty-message") as HTMLDivElement;
const form = document.querySelector("form") as HTMLFormElement;
const selector = document.querySelector("select[name='scale']") as HTMLSelectElement;
const customScaleInput = document.getElementById("customScaleInput") as HTMLTemplateElement;

function onPluginMessage(event: MessageEvent<PluginMessage>) {
  if (event.data.type == "themechange") {
    const message = event.data as ThemeChangedMessage;
    document.body.dataset.theme = message.content
  }
  else if (event.data.type == "textselected") {
    const message = event.data as SelectionChangedMessage
    emptyMessage.classList.toggle("hidden", message.content);
    form.classList.toggle("hidden", !message.content);
  }
}

function onSubmit(event: Event) {
  event.preventDefault();

  const data = new FormData(form);

  const scale = data.get("scale");
  const smallerFonts = data.get("numSmallerFonts");
  const largerFonts = data.get("numLargerFonts");

  console.log({ scale, smallerFonts, largerFonts });
}

function onSelection(event: Event) {
  const target = event.target as HTMLSelectElement;
  const container = customScaleInput.parentNode as HTMLDivElement;
  const content = container.querySelector(".scaleOptions__customInput");

  if (target.value == "custom") {
    if (!content) {
      const clone = customScaleInput.content.cloneNode(true) as DocumentFragment;
      container.appendChild(clone);
    }
  } else {
    console.log(content)
    if (content) {
      container.removeChild(content);
    }
  }
}

window.addEventListener("message", onPluginMessage);
form.addEventListener("submit", onSubmit);
selector.addEventListener("change", onSelection);

// Check if the UI should be shown initially
parent.postMessage("checkSelection", "*");

