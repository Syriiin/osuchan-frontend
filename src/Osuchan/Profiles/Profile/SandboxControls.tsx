import React, { useState } from "react";
import styled, { withTheme, ThemeProps, DefaultTheme } from "styled-components";

import { Surface, Switch, Button } from "../../../components";
import { Gamemode } from "../../../store/models/common/enums";

import SandboxSettingsModal from "./SandboxSettingsModal";

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

const ControlsStatusContainer = styled.div`
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
    const [sandboxSettingsModalOpen, setSandboxSettingsModalOpen] = useState(false);

    return (
        <SandboxControlsSurface>
            <SandboxModeSwitchContainer>
                <SandboxModeHeader>Sandbox Mode</SandboxModeHeader>
                <Switch
                    onChange={checked => props.setSandboxMode(checked)}
                    checked={props.sandboxMode}
                    offColor={props.theme.colours.currant}
                    onColor={props.theme.colours.mystic}
                />
            </SandboxModeSwitchContainer>
            <ControlsStatusContainer>
                <ControlsStatus enabled={props.sandboxMode}>
                    {props.sandboxMode ? "ENABLED" : "DISABLED"}
                </ControlsStatus>
            </ControlsStatusContainer>
            {props.sandboxMode && (
                <Button onClick={() => setSandboxSettingsModalOpen(true)}>Settings</Button>
            )}
            <SandboxSettingsModal gamemode={props.gamemode} open={sandboxSettingsModalOpen} onClose={() => setSandboxSettingsModalOpen(false)} />
        </SandboxControlsSurface>
    );
}

interface SandboxControlsProps extends ThemeProps<DefaultTheme> {
    gamemode: Gamemode;
    sandboxMode: boolean;
    setSandboxMode: (value: React.SetStateAction<boolean>) => void;
}

export default withTheme(SandboxControls);
