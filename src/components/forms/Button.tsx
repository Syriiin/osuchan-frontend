import styled from "styled-components";

export const Button = styled.button<ButtonProps>`
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    background-color: ${props => 
        props.negative ? props.theme.colours.negative :
        props.positive ? props.theme.colours.positive :
        props.theme.colours.currant
    };
    border: none;
    cursor: pointer;
    width: ${props => props.fullWidth ? "100%" : "unset"};

    &:hover {
        filter: brightness(1.2);
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 1px #fff; 
    }
`;

interface ButtonProps {
    fullWidth?: boolean;
    negative?: boolean;
    positive?: boolean;
}
