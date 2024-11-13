import { Theme } from "@penpot/plugin-types";


/**
 * Plugin --> UI
 */
export type PluginMessage = ThemeChangedMessage | SelectionChangedMessage;

export interface ThemeChangedMessage {
    type: "themechanged",
    content: Theme
};

export interface SelectionChangedMessage {
    type: "selectionchanged",
    content: boolean
}

/**
 * UI --> Plugin
 */
export type UIMessage = GenerateTypescaleMessage | CheckSelectionMessage;

export interface GenerateTypescaleMessage {
    type: "generate",
    content: {
        scale: number,
        numSmallerFonts: number,
        numLargerFonts: number,
    }
}

export interface CheckSelectionMessage {
    type: "checkselection"
}
