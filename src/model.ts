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
export interface GenerateMessage {
    scale: number,
    numSmallerFonts: number,
    numLargerFonts: number,
}
