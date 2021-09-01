import styled from "styled-components";

export const Label = styled.span<LabelProps>`
    font-size: 13px;
    padding: 7px;
    border-radius: 15px;
    background-color: ${(props) => props.theme.colours.foreground};
    color: ${(props) =>
        props.special
            ? props.theme.colours.timber
            : props.negative
            ? props.theme.colours.negative
            : props.positive
            ? props.theme.colours.positive
            : "#fff"};
    margin-right: 5px;
    margin-bottom: 5px;
`;

interface LabelProps {
    negative?: boolean;
    positive?: boolean;
    special?: boolean;
}

export const LabelGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
`;
