import styled from "styled-components";
import { Link } from "react-router-dom";

import { Surface } from "../../../components";
import { Gamemode } from "../../../store/models/common/enums";

const ModeSwitcherSurface = styled(Surface)`
    padding: 20px;
    grid-area: modeswitcher;
`;

const ModeSwitcherContainer = styled.ul`
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
`;

const ModeLink = styled(Link)<ModeLinkProps>`
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
    color: ${(props) => (props.$active ? props.theme.colours.mango : "#fff")};

    &:hover {
        text-decoration: none;
        background-color: ${(props) => props.theme.colours.currant};
    }
`;

interface ModeLinkProps {
    $active?: boolean;
}

const ModeSwitcher = (props: ModeSwitcherProps) => (
    <ModeSwitcherSurface>
        <ModeSwitcherContainer>
            <ModeLink
                $active={props.gamemodeId === Gamemode.Standard}
                to={`/users/${props.userString}/osu`}
            >
                <li>osu!</li>
            </ModeLink>
            <ModeLink
                $active={props.gamemodeId === Gamemode.Taiko}
                to={`/users/${props.userString}/taiko`}
            >
                <li>osu!taiko</li>
            </ModeLink>
            <ModeLink
                $active={props.gamemodeId === Gamemode.Catch}
                to={`/users/${props.userString}/catch`}
            >
                <li>osu!catch</li>
            </ModeLink>
            <ModeLink
                $active={props.gamemodeId === Gamemode.Mania}
                to={`/users/${props.userString}/mania`}
            >
                <li>osu!mania</li>
            </ModeLink>
        </ModeSwitcherContainer>
    </ModeSwitcherSurface>
);

interface ModeSwitcherProps {
    gamemodeId: Gamemode;
    userString: string;
}

export default ModeSwitcher;
