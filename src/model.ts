import { Theme } from "@penpot/plugin-types";

export const scales = [
    { value: 16 / 15, name: "Minor Second" },
    { value: 9 / 8, name: "Major Second" },
    { value: 6 / 5, name: "Minor Third" },
    { value: 5 / 4, name: "Major Third" },
    { value: 4 / 3, name: "Perfect Fourth" },
    { value: 45 / 32, name: "Augmented Fourth" },
    { value: 3 / 2, name: "Perfect Fifth" },
    { value: 5 / 3, name: "Minor Sixth" },
    { value: (1 + Math.sqrt(5)) / 2, name: "Golden Ratio" },
    { value: 9 / 5, name: "Major Sixth" },
    { value: 15 / 8, name: "Minor Seventh" },
    { value: 2, name: "Octave" },
    { value: Math.E, name: "Euler's number" },
]

export type ThemeChangedMessage = {
    type: string,
    content: Theme
};

export type SelectionChangedMessage = {
    type: string,
    content: boolean
}

export type PluginMessage = ThemeChangedMessage | SelectionChangedMessage;

export type GenerateMessageData = {
    scale: number,
    customScale: number | null,
    numSmallerFonts: number,
    numLargerFonts: number,
}