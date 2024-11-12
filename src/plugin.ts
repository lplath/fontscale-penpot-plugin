import { Theme, Text } from "@penpot/plugin-types";
import type { GenerateTypescaleMessage, PluginMessage, UIMessage } from "./model";


function createCopy(text: Text, fontSize: number): Text {
    const copy = text.clone() as Text;
    copy.fontSize = fontSize.toString();
    copy.growType = "auto-width";
    return copy;
}

/**
 * Generate textfields with different font sizes
 * @param scale The amount by which the font-size is scaled each time
 * @param numLarger Number of generated font-sizes larger than the basesize
 * @param numSmaller Number of generated font-sizes smaller than the basesize
 */
function createTypescale(scale: number, numLarger: number, numSmaller: number) {
    if (penpot.selection.length != 1 || !penpot.utils.types.isText(penpot.selection[0])) {
        throw new Error("Expected to have one textshape selected. Instead, the selection was: " + penpot.selection)
    }

    const selection = penpot.selection[0] as Text;
    const baseFontSize = parseInt(selection.fontSize);
    const baseFontHeight = selection.height;

    const gap = baseFontHeight * 0.25;

    // Smaller
    for (let i = 1; i <= numSmaller; i++) {
        const text = createCopy(selection, baseFontSize / (scale ** i));
        text.x = selection.x;
        // Sum of the heights is h + h / s + h / s ^ 2 + ... + h / s ^ n (Geometric Series with r = 1 / s)
        // => S_n = h * ((1 - 1 / s ^ (n + 1)) / (1 - 1 / s)) and S_(n - 1) = h * ((1 - 1 / s ^ n) / (1 - 1/s))
        text.y = selection.y + i * gap + baseFontHeight * (1 - 1 / scale ** i) / (1 - 1 / scale);
    }

    // Larger
    for (let i = 1; i <= numLarger; i++) {
        const text = createCopy(selection, baseFontSize * (scale ** i));
        text.x = selection.x;
        // Sum of heights S_n = h * ((1 - s ^ (n + 1))/(1 - s)) - h
        text.y = selection.y - i * gap - (baseFontHeight * ((1 - scale ** (i + 1)) / (1 - scale)) - baseFontHeight);
    }

}

/**
 * Receives a message from the UI (e.g. a button was pressed)
 */
function onMessageReceived(data: string) {
    const message = JSON.parse(data) as UIMessage;

    if (message.type == "generate") {
        const data = (message as GenerateTypescaleMessage).content;

        createTypescale(data.scale, data.numLargerFonts, data.numSmallerFonts);
    }

    // Manually trigger a 'selectionchange' event
    else if (message.type == "checkselection") {
        onSelectionChanged();
    }
}

/**
 * Sends a message to the UI that the theme has changed
 */
function onThemeChanged(theme: Theme) {
    penpot.ui.sendMessage({
        type: "themechanged",
        content: theme,
    } as PluginMessage);
}

/**
 * Sends a message to the UI whenever the selection on the canvas has been changed.
 * The content of the message shows whether a single text-element is selected
 */
function onSelectionChanged() {
    const selection = penpot.selection;
    penpot.ui.sendMessage({
        type: "selectionchanged",
        content: (selection.length == 1 && penpot.utils.types.isText(selection[0]))
    } as PluginMessage)
}

penpot.ui.open("Typescale", `?theme=${penpot.theme}`, { width: 280, height: 320 });
penpot.ui.onMessage(onMessageReceived);
penpot.on("selectionchange", onSelectionChanged);
penpot.on("themechange", onThemeChanged);