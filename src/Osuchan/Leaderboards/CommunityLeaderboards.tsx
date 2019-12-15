import React, { useContext, useState } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

import { Leaderboard } from "../../store/models/leaderboards/types";
import { Surface, SurfaceTitle, UnstyledLink, Button } from "../../components";
import { StoreContext } from "../../store";
import CreateLeaderboardModal from "./CreateLeaderboardModal";
import { CommunityLeaderboardRow } from "../../components/layout/CommunityLeaderboardRow";

const CommunityLeaderboardsSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

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