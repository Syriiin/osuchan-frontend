import React, { useContext, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

import { Leaderboard } from "../../store/models/leaderboards/types";
import { Surface, SurfaceTitle, UnstyledLink, Button, Row } from "../../components";
import { OsuUser } from "../../store/models/profiles/types";
import { StoreContext } from "../../store";
import CreateLeaderboardModal from "./CreateLeaderboardModal";

const CommunityLeaderboardsSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const LeaderboardTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 10px;
`;

const LeaderboardTitle = styled.span`
    font-size: 1.5em;
`;

const LeaderboardCreator = styled.span`
    color: ${props => props.theme.colours.timber};
`;

const LeaderboardIcon = styled.img`

`;

function LeaderboardRow(props: LeaderboardRowProps) {
    const leaderboard = props.leaderboard;
    const owner = leaderboard.owner as OsuUser;

    return (
        <Row hoverable>
            <LeaderboardIcon src={leaderboard.iconUrl || "https://osu.ppy.sh/images/badges/mods/mod_coop@2x.png"} />
            <LeaderboardTitleContainer>
                <LeaderboardTitle>{leaderboard.name}</LeaderboardTitle>
                <LeaderboardCreator>{owner.username}</LeaderboardCreator>
            </LeaderboardTitleContainer>
        </Row>
    );
}

interface LeaderboardRowProps {
    leaderboard: Leaderboard;
}

function CommunityLeaderboards(props: CommunityLeaderboardsProps) {
    const store = useContext(StoreContext);
    const meStore = store.meStore;

    const [createLeaderboardModalOpen, setCreateLeaderboardModalOpen] = useState(false);

    return (
        <>
            <CommunityLeaderboardsSurface>
                <SurfaceTitle>
                    Community Leaderboards
                    {meStore.osuUser && (
                        <Button onClick={() => setCreateLeaderboardModalOpen(true)}>Create</Button>
                    )}
                </SurfaceTitle>
                {props.leaderboards.map((leaderboard, i) => (
                    <UnstyledLink key={i} to={`/leaderboards/${leaderboard.id}`}>
                        <LeaderboardRow leaderboard={leaderboard} />
                    </UnstyledLink>
                ))}
            </CommunityLeaderboardsSurface>
            <CreateLeaderboardModal open={createLeaderboardModalOpen} onClose={() => setCreateLeaderboardModalOpen(false)} />
        </>
    );
}

interface CommunityLeaderboardsProps {
    leaderboards: Leaderboard[];
}

export default observer(CommunityLeaderboards);
