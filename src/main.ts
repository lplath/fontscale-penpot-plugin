import "./style.css";


const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

// FIXME: If a textbox is selected, when the plugin is opened, the UI should be visible
let uiVisible = false;

let uiContainer = document.getElementById("ui") as HTMLDivElement;
let emptyMessage = document.getElementById("empty-message") as HTMLDivElement;
let ratioSelector = document.getElementById("ratio") as HTMLSelectElement;
let upForm = document.getElementById("up") as HTMLInputElement;
let downForm = document.getElementById("down") as HTMLInputElement;


document.getElementById("generate")?.addEventListener("click", () => {
  const scale = ratioSelector?.value;
  const up = upForm?.value;
  const down = downForm?.value;
  parent.postMessage(`generate-${JSON.stringify({ scale, up, down })}`, "*");
});


window.addEventListener("message", (event) => {
  switch (event.data.type) {
    case "themechange":
      document.body.dataset.theme = event.data.content;
      break;
    case "textselected":
      const oneTextElementSelected = event.data.content as boolean;

      if (oneTextElementSelected && !uiVisible) {
        // Show UI
        uiVisible = true;
        uiContainer?.classList.remove("hidden");
        emptyMessage?.classList.add("hidden");
      }
      else if (!oneTextElementSelected && uiVisible) {
        // Hide UI
        uiVisible = false;
        uiContainer?.classList.add("hidden");
        emptyMessage?.classList.remove("hidden");
      }
      break;
  }
});
