import { DefaultTheme } from "styled-components";

const getColour = (key: string, fallback: string) =>
    `var(--colours-${key}, ${fallback})`;

export const osuchanTheme: DefaultTheme = {
    colours: {
        pillow: getColour("pillow", "#3A3ACC"),
        currant: getColour("currant", "#574566"),
        mystic: getColour("mystic", "#A02EFF"),
        timber: getColour("timber", "#D2B66F"),
        mango: getColour("mango", "#FFAF2E"),
        positive: getColour("positive", "#2FCC6A"),
        warning: getColour("warning", "#CCAE25"),
        negative: getColour("negative", "#CC544E"),
        foreground: getColour("foreground", "#363663"),
        midground: getColour("midground", "#29293D"),
        background: getColour("background", "#17171C"),
    },
};
