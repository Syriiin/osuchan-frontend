import React from "react";
import styled from "styled-components";
import ReactTooltip, { TooltipProps as ReactTooltipProps } from "react-tooltip";

const StyledTooltip = styled(ReactTooltip)`
    font-style: normal;

    &.place-top.type-dark {
        background-color: ${props => props.theme.colours.background};
        
        :after {
            border-top-color: ${props => props.theme.colours.background};
        }
    }
`;

export const Tooltip = (props: TooltipProps) => (
    <StyledTooltip {...props} place="top" type="dark" effect="solid" />
);

interface TooltipProps extends ReactTooltipProps {
    id: string;
}
