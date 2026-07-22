import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label, Button } from "../../components";
import { statusPillColour } from "./formatting";
import { MinigameStatus } from "../../store/models/minigames/types";

export const GamemodeIcon = styled.img`
    width: 18px;
    height: 18px;
    margin-right: 4px;
    vertical-align: middle;
    filter: brightness(0) invert(1);
`;

export const MetaIcon = styled(FontAwesomeIcon)`
    width: 14px;
    height: 14px;
    margin-right: 4px;
    vertical-align: middle;
`;

export const MetaItem = styled.span`
    color: ${(props) => props.theme.colours.timber};
    display: flex;
    align-items: center;
    gap: 4px;

    &::before {
        content: "\00B7";
        margin-right: 4px;
    }

    &:first-child::before {
        content: none;
    }
`;

export const StatusBadge = styled(Label)<{ $status: MinigameStatus }>`
    background-color: ${(props) => statusPillColour(props.$status, props.theme)};
    color: #fff;
    font-weight: 600;
`;

export const SectionSpacer = styled.div`
    margin-top: 20px;
`;

export const EmptyState = styled.p`
    text-align: center;
    color: ${(props) => props.theme.colours.timber};
    padding: 40px;
`;

export const IconLeft = styled(FontAwesomeIcon)`
    margin-right: 4px;
`;

export const SettingsDescription = styled.p`
    color: gray;
    font-size: 0.85em;
    margin: -10px 0 20px 0;
`;

export const SettingsSubmit = styled(Button)`
    margin-top: 20px;
`;
