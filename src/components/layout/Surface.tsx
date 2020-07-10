import styled from "styled-components";

export const Surface = styled.div`
    background-color: ${props => props.theme.colours.midground};
    border-radius: 5px;
`;

export const SurfaceHeaderContainer = styled.div`
    display: flex;
    align-content: center;
`;

export const SurfaceTitle = styled.h3`
    margin: 0 0 20px 0;
    font-size: 1.7em;
    font-weight: 200;
    flex-grow: 1;
`;

export const SurfaceSubtitle = styled.h4`
    margin: 0 0 10px 0;
    font-size: 1.5em;
    font-weight: 700;
    flex-grow: 1;
`;
