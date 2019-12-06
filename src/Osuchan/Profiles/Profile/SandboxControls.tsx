import React from "react";
import styled, { withTheme, ThemeProps, DefaultTheme } from "styled-components";
import Switch from "react-switch";

import { Surface } from "../../../components";

const SandboxControlsSurface = styled(Surface)`
    padding: 20px;
    grid-area: sandboxcontrols;
    display: flex;
    flex-direction: column;
`;

const SandboxModeSwitchContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const SandboxModeHeader = styled.h3`
    margin: 0;
`;

const ControlsContainer = styled.div`
    display: flex;
    flex-grow: 1;
    align-items: center;
    text-align: center;
`;

const ControlsStatus = styled.span<ControlsStatusProps>`
    color: ${props => props.enabled ? props.theme.colours.timber : props.theme.colours.currant};
    width: 100%;
    font-size: 2em;
    font-weight: bolder;
    transition: color 250ms;
`;

interface ControlsStatusProps {
    enabled: boolean;
}

function SandboxControls(props: SandboxControlsProps) {
    return (
        <SandboxControlsSurface>
            <SandboxModeSwitchContainer>
                <SandboxModeHeader>Sandbox Mode</SandboxModeHeader>
                <Switch
                    onChange={(checked, event, id) => props.setSandboxMode(checked)}
                    checked={props.sandboxMode}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    offColor={props.theme.colours.currant}
                    onColor={props.theme.colours.mystic}
                />
            </SandboxModeSwitchContainer>
            <ControlsContainer>
                <ControlsStatus enabled={props.sandboxMode}>{props.sandboxMode ? "ENABLED" : "DISABLED"}</ControlsStatus>
            </ControlsContainer>
        </SandboxControlsSurface>
    );
}

interface SandboxControlsProps extends ThemeProps<DefaultTheme> {
    sandboxMode: boolean;
    setSandboxMode: (value: React.SetStateAction<boolean>) => void;
}

export default withTheme(SandboxControls);
