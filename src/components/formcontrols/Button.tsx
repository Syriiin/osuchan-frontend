import styled from "styled-components";

export const Button = styled.button<ButtonProps>`
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    background-color: ${props => props.theme.colours.currant};
    border: none;
    cursor: pointer;
    width: ${props => props.fullWidth ? "100%" : "unset"};

    &:hover {
        background-color: ${props => props.theme.colours.mystic};
    }

    &:focus {
        outline: none;
    }
`;

interface ButtonProps {
    fullWidth?: boolean;
}
