import styled from "styled-components";

export const Button = styled.button`
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    background-color: ${props => props.theme.colours.currant};
    border: none;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.colours.mystic};
    }

    &:focus {
        outline: none;
    }
`;
