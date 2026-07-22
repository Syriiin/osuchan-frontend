import { type DefaultTheme } from "styled-components";
import { MinigameStatus } from "../../store/models/minigames/types";

export function formatGameType(gameType: string): string {
    switch (gameType) {
        case "first_to_n":
            return "First to N";
        case "lockout_bingo":
            return "Lockout Bingo";
        default:
            return gameType;
    }
}

const GOLDEN_ANGLE = 137.508;
const TEAM_COLOUR_SATURATION = 70;
const TEAM_COLOUR_LIGHTNESS = 55;
const TEAM_COLOUR_DARK_LIGHTNESS = 15;

export function getTeamColor(index: number): string {
    const hue = (index * GOLDEN_ANGLE) % 360;
    return `hsl(${hue}, ${TEAM_COLOUR_SATURATION}%, ${TEAM_COLOUR_LIGHTNESS}%)`;
}

export function getTeamColorDark(index: number): string {
    const hue = (index * GOLDEN_ANGLE) % 360;
    return `hsl(${hue}, ${TEAM_COLOUR_SATURATION}%, ${TEAM_COLOUR_DARK_LIGHTNESS}%)`;
}

export function statusLabel(status: MinigameStatus): string {
    switch (status) {
        case MinigameStatus.Lobby:
            return "Lobby";
        case MinigameStatus.WaitingToStart:
            return "Starting soon";
        case MinigameStatus.InProgress:
            return "In progress";
        case MinigameStatus.Finalising:
            return "Finalising";
        case MinigameStatus.Finished:
            return "Finished";
    }
}

export function statusPillColour(status: MinigameStatus, theme: DefaultTheme): string {
    switch (status) {
        case MinigameStatus.Lobby:
            return theme.colours.currant;
        case MinigameStatus.WaitingToStart:
            return theme.colours.warning;
        case MinigameStatus.InProgress:
            return theme.colours.positive;
        case MinigameStatus.Finalising:
            return theme.colours.mango;
        case MinigameStatus.Finished:
            return theme.colours.timber;
    }
}
