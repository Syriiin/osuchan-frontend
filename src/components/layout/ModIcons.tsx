import React from "react";
import styled from "styled-components";

import { modsAsArray } from "../../utils/osu";
import { Mods } from "../../store/models/common/enums";
import { Tooltip } from "./Tooltip";
import { formatModName, formatModNameShort } from "../../utils/formatting";

const ModImage = styled.img`
    max-height: 100%;
`;

export const ModIcons = (props: ModIconsProps) => {
    const mods = modsAsArray(props.bitwiseMods);

    return (
        <>
            {mods.map(mod => (
                <React.Fragment key={mod}>
                    <ModImage data-tip={formatModName(mod)} data-for={`mod-${mod}`} src={`/static/images/mods/mod_${formatModNameShort(mod)}${props.small ? "" : "@2x"}.png`} />
                    <Tooltip id={`mod-${mod}`} />
                </React.Fragment>
            ))}
        </>
    );
}

interface ModIconsProps {
    bitwiseMods: Mods;
    small?: boolean;
}
