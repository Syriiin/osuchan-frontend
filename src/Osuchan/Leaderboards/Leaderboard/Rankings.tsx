import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { useRouteMatch } from "react-router";

import { Surface, Row, SurfaceTitle, UnstyledLink, NumberFormat, Flag } from "../../../components";
import { Membership } from "../../../store/models/leaderboards/types";

const RankingsSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const Rank = styled.span`
    margin-right: 5px;
    width: 50px;
    text-align: center;
    font-size: 1.5em;
`;

const PlayerInfo = styled.div`
    display: flex;
    align-items: center;
    margin-right: 5px;
    width: 200px;
    flex-grow: 1;
`;

const Avatar = styled.img`
    width: 50px;
    border-radius: 5px;
    margin-right: 10px;
`;

const FlagContainer = styled.div`
    margin-right: 10px;
`;

const Username = styled.span`
    font-size: 1.1em;
`;

const PerformanceContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
`;

const Performance = styled.span`
    font-size: 1.5em;
`;

const ScoreCount = styled.span`
    font-size: 0.8em;
`;

const RankingRow = (props: RankingRowProps) => (
    <Row hoverable>
        <Rank>#{props.rank.toLocaleString("en")}</Rank>
        <PlayerInfo>
            <Avatar src={`https://a.ppy.sh/${props.membership.osuUserId}`} />
            <FlagContainer>
                <Flag countryCode={props.membership.osuUser!.country} />
            </FlagContainer>
            <Username>
                {props.membership.osuUser!.username}
            </Username>
        </PlayerInfo>
        <PerformanceContainer>
            <Performance>
                <NumberFormat value={props.membership.pp} decimalPlaces={0} />pp
            </Performance>
            <ScoreCount>
                {props.membership.scoreCount} scores
            </ScoreCount>
        </PerformanceContainer>
    </Row>
);

interface RankingRowProps {
    membership: Membership;
    rank: number;
}

const Rankings = observer((props: TopScoresProps) => {
    const match = useRouteMatch();

    return (
        <RankingsSurface>
            <SurfaceTitle>Rankings</SurfaceTitle>
            {props.memberships.map((membership, i) => (
                <UnstyledLink key={i} to={`${match.url}/members/${membership.osuUserId}`}>
                    <RankingRow membership={membership} rank={i + 1} />
                </UnstyledLink>
            ))}
        </RankingsSurface>
    );
});

interface TopScoresProps {
    memberships: Membership[];
}

export default Rankings;
