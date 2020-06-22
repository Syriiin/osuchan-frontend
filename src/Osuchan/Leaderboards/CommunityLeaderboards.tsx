import React, { useContext, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

import { Leaderboard } from "../../store/models/leaderboards/types";
import { Surface, SurfaceTitle, UnstyledLink, Button, Row } from "../../components";
import { StoreContext } from "../../store";
import CreateLeaderboardModal from "./CreateLeaderboardModal";
import { LeaderboardAccessType } from "../../store/models/leaderboards/enums";

const CommunityLeaderboardsSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const LeaderboardIconContainer = styled.div`
    height: 86px;
    display: flex;
    align-items: center;
`;

const LeaderboardIcon = styled.img`
    border-radius: 5px;
    width: 86px;
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

const LeaderboardType = styled.span`
    font-size: 0.8em;
    color: ${props => props.theme.colours.mango};
`;

const LeaderboardCreator = styled.span`
    color: ${props => props.theme.colours.timber};
`;

export const CommunityLeaderboardRow = (props: CommunityLeaderboardRowProps) => {
    const leaderboard = props.leaderboard;

    return (
        <Row hoverable>
            <LeaderboardIconContainer>
                <LeaderboardIcon src={leaderboard.iconUrl || `https://a.ppy.sh/${leaderboard.owner!.id}`} />
            </LeaderboardIconContainer>
            <LeaderboardTitleContainer>
                <LeaderboardTitle>{leaderboard.name}</LeaderboardTitle>
                <LeaderboardType>
                    {leaderboard.accessType === LeaderboardAccessType.Public && "PUBLIC"}
                    {leaderboard.accessType === LeaderboardAccessType.PublicInviteOnly && "INVITE-ONLY"}
                    {leaderboard.accessType === LeaderboardAccessType.Private && "PRIVATE"}
                </LeaderboardType>
                <LeaderboardCreator>{leaderboard.owner!.username}</LeaderboardCreator>
            </LeaderboardTitleContainer>
        </Row>
    );
}

interface CommunityLeaderboardRowProps {
    leaderboard: Leaderboard;
}

const CommunityLeaderboards = (props: CommunityLeaderboardsProps) => {
    const store = useContext(StoreContext);
    const meStore = store.meStore;

    const [createLeaderboardModalOpen, setCreateLeaderboardModalOpen] = useState(false);

    return (
        <>
            <CommunityLeaderboardsSurface>
                <SurfaceTitle>
                    Community Leaderboards
                    {meStore.user?.osuUser && (
                        <Button type="button" action={() => setCreateLeaderboardModalOpen(true)}>Create leaderboard</Button>
                    )}
                </SurfaceTitle>
                {props.leaderboards.map((leaderboard, i) => (
                    <UnstyledLink key={i} to={`/leaderboards/${leaderboard.id}`}>
                        <CommunityLeaderboardRow leaderboard={leaderboard} />
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
