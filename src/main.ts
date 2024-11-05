import { Message, SelectionChangedMessage, ThemeChangedMessage } from "./model";
import "./style.css";


const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const uiContainer = document.getElementById("ui") as HTMLDivElement;
const emptyMessage = document.getElementById("empty-message") as HTMLDivElement;
const ratioSelector = document.getElementById("ratio") as HTMLSelectElement;
const upForm = document.getElementById("up") as HTMLInputElement;
const downForm = document.getElementById("down") as HTMLInputElement;

// FIXME: If a textbox is selected, when the plugin is opened, the UI should be visible
let uiVisible = false;

document.getElementById("generate")?.addEventListener("click", () => {
  const scale = ratioSelector?.value;
  const up = upForm?.value;
  const down = downForm?.value;
  parent.postMessage(`generate-${JSON.stringify({ scale, up, down })}`, "*");
});


window.addEventListener("message", (event: MessageEvent<Message>) => {
  if (event.data.type == "themechange") {
    const message = event.data as ThemeChangedMessage;

    document.body.dataset.theme = message.content
  }
  else if (event.data.type == "textselected") {
    const message = event.data as SelectionChangedMessage

    if (message.content && !uiVisible) {
      // Show UI
      uiVisible = true;
      uiContainer?.classList.remove("hidden");
      emptyMessage?.classList.add("hidden");
    }
    else if (!message.content && uiVisible) {
      // Hide UI
      uiVisible = false;
      uiContainer?.classList.add("hidden");
      emptyMessage?.classList.remove("hidden");
    }
  }
});
