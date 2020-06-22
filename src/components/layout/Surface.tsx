import styled from "styled-components";

export const Surface = styled.div`
    background-color: ${props => props.theme.colours.midground};
`;

export const SurfaceHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const SurfaceTitle = styled.h3`
    margin: 0 0 20px 0;
    font-size: 1.7em;
    font-weight: 200;
`;
