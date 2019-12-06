import styled from "styled-components";

export const TextInput = styled.input<TextInputProps>`
    display: block;
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    border-width: 0;
    color: #fff;
    background-color: ${props => props.theme.colours.background};
    width: ${props => props.fullWidth ? "100%" : "auto"};

    &:focus {
        outline-style: none;
    }
`;

export interface TextInputProps {
    fullWidth?: boolean;
}
