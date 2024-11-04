import { Theme } from "@penpot/plugin-types";

function createTypescale(scale: number, up: number, down: number) {
  //TODO
}

function onMessageReceived(message: string) {
  if (message.startsWith("generate")) {
    const { scale, up, down } = JSON.parse(message.split("-")[1]) as { scale: number, up: number, down: number };
    createTypescale(scale, up, down);
  }
}

function onThemeChanged(theme: Theme) {
  penpot.ui.sendMessage({
    type: "themechange",
    content: theme,
  });
}

function onSelectionChanged() {
  const selection = penpot.selection;
  penpot.ui.sendMessage({
    type: "textselected",
    content: (selection.length == 1 && penpot.utils.types.isText(selection[0]))
  })
}

penpot.ui.open("Typescale", `?theme=${penpot.theme}`, { width: 260, height: 290});
penpot.ui.onMessage(onMessageReceived);
penpot.on("selectionchange", onSelectionChanged);
penpot.on("themechange", onThemeChanged);

onSelectionChanged();