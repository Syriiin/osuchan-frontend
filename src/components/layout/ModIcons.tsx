import React from "react";
import styled from "styled-components";

import { Tooltip } from "./Tooltip";
import { formatModName } from "../../utils/formatting";
import { ModsJson } from "../../store/models/profiles/types";
import { modAcronymsFromJsonMods } from "../../utils/osu";
import { ModAcronym } from "../../store/models/common/enums";

const ModImage = styled.img`
    max-height: 100%;
`;

const DIFFICULTY_INCREASING_BLANKS = [
    ModAcronym.Blinds,
    ModAcronym.AccuracyChallenge,
];

const DIFFICULTY_DECREASING_BLANKS = [
    ModAcronym.Daycore,
];

const FUN_BLANKS = [
    ModAcronym.Tracing,
    ModAcronym.Muted,
    ModAcronym.NoScope,
];

const ModIcon = (props: ModIconProps) => {
    const acronym = props.acronym;

    if (DIFFICULTY_INCREASING_BLANKS.includes(acronym as ModAcronym)) {
        return (
            <>
                <ModImage
                    data-tip={formatModName(acronym)}
                    data-for={`mod-${acronym}`}
                    src={`/static/images/mods/blanks/DifficultyIncrease${props.small ? "" : "@2x"}.png`} />
                <Tooltip id={`mod-${acronym}`} />
            </>
        );
    }

    if (DIFFICULTY_DECREASING_BLANKS.includes(acronym as ModAcronym)) {
        return (
            <>
                <ModImage
                    data-tip={formatModName(acronym)}
                    data-for={`mod-${acronym}`}
                    src={`/static/images/mods/blanks/DifficultyReduction${props.small ? "" : "@2x"}.png`} />
                <Tooltip id={`mod-${acronym}`} />
            </>
        );
    }

    if (FUN_BLANKS.includes(acronym as ModAcronym)) {
        return (
            <>
                <ModImage
                    data-tip={formatModName(acronym)}
                    data-for={`mod-${acronym}`}
                    src={`/static/images/mods/blanks/Fun${props.small ? "" : "@2x"}.png`} />
                <Tooltip id={`mod-${acronym}`} />
            </>
        );
    }

    return (
        <>
            <ModImage
                data-tip={formatModName(acronym)}
                data-for={`mod-${acronym}`}
                src={`/static/images/mods/mod_${acronym}${props.small ? "" : "@2x"}.png`} />
            <Tooltip id={`mod-${acronym}`} />
        </>
    );
}

interface ModIconProps {
    acronym: string;
    small?: boolean;
}

export const ModIcons = (props: ModIconsProps) => {
    const mods = modAcronymsFromJsonMods(props.mods);
    return (
        <>
            {mods.map((mod) => (
                <React.Fragment key={mod}>
                    <ModIcon acronym={mod} small={props.small} />
                </React.Fragment>
            ))}
        </>
    );
};

interface ModIconsProps {
    mods: ModsJson;
    small?: boolean;
}
