import styled from "styled-components";

export const Row = styled.div<RowProps>`
    display: flex;
    align-items: center;
    margin: 5px 0;
    padding: 5px;
    border-radius: 5px;
    background-color: ${props => props.theme.colours.foreground};
    cursor: ${props => props.hoverable ? "pointer" : "unset"};

    &:hover {
        background-color: ${props => props.hoverable ? props.theme.colours.pillow : props.theme.colours.foreground};
    }
`;

interface RowProps {
    hoverable?: boolean;
}