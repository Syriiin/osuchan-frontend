import React from "react";
import styled from "styled-components";

import { Tooltip } from "./Tooltip";
import { formatModName } from "../../utils/formatting";
import { ModsJson } from "../../store/models/profiles/types";
import { modAcronymsFromJsonMods } from "../../utils/osu";

const ModImage = styled.img`
    max-height: 100%;
`;

export const ModIcons = (props: ModIconsProps) => {
    const mods = modAcronymsFromJsonMods(props.mods);
    return (
        <>
            {mods.map((mod) => (
                <React.Fragment key={mod}>
                    <ModImage
                        data-tip={formatModName(mod)}
                        data-for={`mod-${mod}`}
                        src={`/static/images/mods/mod_${mod}${props.small ? "" : "@2x"}.png`} />
                    <Tooltip id={`mod-${mod}`} />
                </React.Fragment>
            ))}
        </>
    );
};

interface ModIconsProps {
    mods: ModsJson;
    small?: boolean;
}
