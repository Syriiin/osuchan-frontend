import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";

import { SimpleModal, LoadingSection, Divider, ScoreRow, Button, NumberFormat, Flag } from "../../../components";
import { StoreContext } from "../../../store";
import { ResourceStatus } from "../../../store/status";

const UserInfo = styled.div`
    display: flex;
`;

const Avatar = styled.img`
    border-radius: 15px;
    height: 128px;
    width: 128px;
`;

const UserInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    flex-grow: 1;
`;

const UserInfoRow = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3em;
`;

const Username = styled.span`
    font-size: 1.5em;
`;

const Rank = styled.span`
    font-size: 3em;
`;

const Performance = styled.span`
    font-size: 1.5em;
`;

const ScoreCount = styled.span`
    font-size: 1em;
`;

const MemberInfo = observer(() => {
    const params = useParams<RouteParams>();
    const location = useLocation();
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;
    const meStore = store.meStore;

    const userId = parseInt(params.userId);
    const { loadingStatus, loadingMembershipStatus, leaderboard, membership, membershipScores, loadMembership } = detailStore;
    const { isAuthenticated, user } = meStore;

    useEffect(() => {
        if (loadingMembershipStatus === ResourceStatus.Loading) {
            document.title = "Loading...";
        } else if (leaderboard && membership) {
            document.title = `${membership.osuUser!.username} - ${leaderboard.name} - osu!chan`;
        } else {
            document.title = `Member not found - osu!chan`;
        }
    }, [location, loadingStatus, loadingMembershipStatus, leaderboard, membership]);

    useEffect(() => {
        if (leaderboard !== null && !isNaN(userId)) {
            loadMembership(userId);
        }
    }, [userId, leaderboard, loadMembership]);

    const [showAllScores, setShowAllScores] = useState(false);

    return (
        <>
            {loadingMembershipStatus === ResourceStatus.Loaded && membership && (
                <>
                    <UserInfo>
                        <Avatar src={`https://a.ppy.sh/${membership.osuUserId}`} />
                        <UserInfoContainer>
                            <UserInfoRow>
                                <Username>
                                    {membership.osuUser!.username}
                                </Username>
                            </UserInfoRow>
                            <UserInfoRow>
                                <Flag countryCode={membership.osuUser!.country} showFullName />
                            </UserInfoRow>
                            <UserInfoRow>
                                <ScoreCount>{membership.scoreCount} scores</ScoreCount>
                            </UserInfoRow>
                        </UserInfoContainer>
                        <UserInfoContainer>
                            <UserInfoRow>
                                <Rank>#{membership.rank.toLocaleString("en")}</Rank>
                            </UserInfoRow>
                            <UserInfoRow>
                                <Performance>
                                    <NumberFormat value={membership.pp} decimalPlaces={0} />pp
                                </Performance>
                            </UserInfoRow>
                        </UserInfoContainer>
                    </UserInfo>

                    {isAuthenticated && leaderboard!.ownerId === user!.osuUserId && membership?.osuUserId !== user!.osuUserId && (
                        <>
                            <Divider spacingScale={5} />
                            <Button negative isLoading={detailStore.isKickingMember} action={() => detailStore.kickMember()} confirmationMessage="Are you sure you want to kick this member from the leaderboard?">Kick Member</Button>
                        </>
                    )}

                    <Divider spacingScale={5} />

                    {(showAllScores ? membershipScores : membershipScores.slice(0, 5)).map((score, i) => (
                        <ScoreRow key={i} score={score} hidePlayerInfo />
                    ))}
                    {membershipScores.length <= 5 || showAllScores || (
                        <Button type="button" fullWidth action={() => setShowAllScores(true)}>Show More</Button>
                    )}
                    {membershipScores.length === 0 && (
                        <p>This member has no eligible scores for this leaderboard yet...</p>
                    )}
                </>
            )}
            {loadingMembershipStatus === ResourceStatus.Loading && (
                <LoadingSection />
            )}
            {loadingMembershipStatus === ResourceStatus.Error && (
                <h3>Member not found!</h3>
            )}
        </>
    );
});

const MemberModal = (props: MemberModalProps) => (
    <SimpleModal open={props.open} onClose={props.onClose}>
        <MemberInfo />
    </SimpleModal>
);

interface MemberModalProps {
    open: boolean;
    onClose: () => void;
}

interface RouteParams {
    leaderboardType: "global" | "community";
    gamemode: "osu" | "taiko" | "catch" | "mania";
    leaderboardId: string;
    userId: string;
}

export default MemberModal;
