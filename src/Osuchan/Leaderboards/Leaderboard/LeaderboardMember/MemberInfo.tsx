import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import { Surface } from "../../../../components";
import { Membership } from "../../../../store/models/leaderboards/types";

const MemberInfoSurface = styled(Surface)`
    padding: 20px;
    grid-area: memberinfo;
    display: flex;
    flex-direction: column;
`;

const MemberInfoRow = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3em;
`;

const JoinIcon = styled(FontAwesomeIcon)`
    margin-right: 0.5em;
`;

const Performance = styled.span`
    font-size: 1.5em;
`;

const ScoreCount = styled.span`

`;

const MemberInfo = (props: MemberInfoProps) => {
    const membership = props.membership;

    return (
        <MemberInfoSurface>
            <MemberInfoRow>
                <Performance>
                    {membership.pp.toLocaleString("en", { maximumFractionDigits: 0 })}pp
                </Performance>
            </MemberInfoRow>
            <MemberInfoRow>
                <ScoreCount>
                    {membership.scoreCount} scores
                </ScoreCount>
            </MemberInfoRow>
            <MemberInfoRow>
                <JoinIcon icon={faSignInAlt} />
                {membership.joinDate.toDateString()}
            </MemberInfoRow>
        </MemberInfoSurface>
    );
}

interface MemberInfoProps {
    membership: Membership;
}

export default MemberInfo;
