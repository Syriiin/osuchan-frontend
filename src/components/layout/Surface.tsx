import styled from "styled-components";

export const Surface = styled.div`
    background-color: ${props => props.theme.colours.midground};
`;

export const SurfaceTitle = styled.h3`
    display: flex;
    justify-content: space-between;
    margin: 0 0 20px 0;
    font-size: 1.7em;
    font-weight: 200;
`;
