import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colours: {
            pillow: string;
            currant: string;
            mystic: string;
            timber: string;
            mango: string;
            positive: string;
            warning: string;
            negative: string;
            foreground: string;
            midground: string;
            background: string;
        }
    }
}
