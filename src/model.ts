import { Theme } from "@penpot/plugin-types";


/**
 * Plugin --> UI
 */
export type PluginMessage = ThemeChangedMessage | SelectionChangedMessage;

export type ThemeChangedMessage = {
    type: "themechanged",
    content: Theme
};

export type SelectionChangedMessage = {
    type: "selectionchanged",
    content: boolean
}

/**
 * UI --> Plugin
 */
export type UIMessage = GenerateTypescaleMessage | CheckSelectionMessage;

export type GenerateTypescaleMessage = {
    type: "generate",
    content: {
        scale: number,
        numSmallerFonts: number,
        numLargerFonts: number,
    }
}

export type CheckSelectionMessage = {
    type: "checkselection"
}
