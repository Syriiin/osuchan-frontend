import styled from "styled-components";

export const Divider = styled.div<DividerProps>`
    height: 1px;
    border-top: 1px solid ${props => props.theme.colours.currant};
    margin-top: ${props => (props.spacingScale ?? 1) * 5}px;
    margin-bottom: ${props => (props.spacingScale ?? 1) * 5}px;
`;

interface DividerProps {
    spacingScale?: number;
}
