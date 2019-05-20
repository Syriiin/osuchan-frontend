import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colours: {
            primary: string;
            secondary: string;
            dark: string;
            detail: string;
            backdrop: string;
        }
    }
}
