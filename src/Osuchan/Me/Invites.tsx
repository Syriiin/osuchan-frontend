import { useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet";

import {
    LoadingPage,
    Surface,
    SurfaceTitle,
    Row,
    UnstyledLink,
    Button,
} from "../../components";
import { Invite } from "../../store/models/leaderboards/types";
import { LeaderboardAccessType } from "../../store/models/leaderboards/enums";
import { formatGamemodeNameShort } from "../../utils/formatting";
import { ResourceStatus } from "../../store/status";
import { useStore } from "../../utils/hooks";

const InvitesSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const LeaderboardIconContainer = styled.div`
    width: 86px;
    height: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LeaderboardIcon = styled.img`
    border-radius: 5px;
    max-width: 100%;
    max-height: 100%;
    margin-right: 10px;
`;

const LeaderboardTitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 200px;
    margin-right: 10px;
`;

const LeaderboardTitle = styled.span`
    font-size: 1.5em;
`;

const LeaderboardType = styled.span`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.mango};
`;

const LeaderboardSubtitle = styled.span`
    color: ${(props) => props.theme.colours.timber};
`;

const InviteMessage = styled.div`
    flex-grow: 1;
`;

const DeclineButton = styled(Button)`
    margin-left: 5px;
`;

const InviteRow = observer((props: InviteRowProps) => {
    const store = useStore();
    const meStore = store.meStore;

    const invite = props.invite;

    return (
        <Row>
            <LeaderboardIconContainer>
                <LeaderboardIcon src={invite.leaderboard!.iconUrl} />
            </LeaderboardIconContainer>
            <LeaderboardTitleContainer>
                <LeaderboardTitle>{invite.leaderboard!.name}</LeaderboardTitle>
                <LeaderboardType>
                    {invite.leaderboard!.accessType ===
                        LeaderboardAccessType.PublicInviteOnly && "INVITE-ONLY"}
                    {invite.leaderboard!.accessType ===
                        LeaderboardAccessType.Private && "PRIVATE"}
                </LeaderboardType>
                <LeaderboardSubtitle>
                    {invite.leaderboard!.memberCount} members
                </LeaderboardSubtitle>
            </LeaderboardTitleContainer>
            <InviteMessage>{invite.message}</InviteMessage>
            <Button
                as={UnstyledLink}
                to={`/leaderboards/community/${formatGamemodeNameShort(
                    invite.leaderboard!.gamemode
                )}/${invite.leaderboardId}`}
                type="button"
            >
                View Leaderboard
            </Button>
            <DeclineButton
                negative
                isLoading={meStore.isDecliningInvite}
                action={() => meStore.declineInvite(invite.leaderboardId)}
                confirmationMessage="Are you sure you want to decline this invite?"
            >
                Decline Invite
            </DeclineButton>
        </Row>
    );
});

interface InviteRowProps {
    invite: Invite;
}

const Invites = observer(() => {
    const store = useStore();
    const meStore = store.meStore;

    // use effect to fetch me data (already doing this in nav, but makes sense to refetch incase changes such as more invites)
    const { loadingStatus, invites } = meStore;
    useEffect(() => {
        meStore.loadMe();
    }, [meStore]);

    return (
        <>
            <Helmet>
                {loadingStatus === ResourceStatus.Loading && (
                    <title>Loading...</title>
                )}
                {loadingStatus === ResourceStatus.Loaded && (
                    <title>Invites - osu!chan</title>
                )}
            </Helmet>

            {loadingStatus === ResourceStatus.Loading && <LoadingPage />}
            {loadingStatus === ResourceStatus.Loaded && (
                <InvitesSurface>
                    <SurfaceTitle>My Invites</SurfaceTitle>
                    {invites.map((invite) => (
                        <InviteRow invite={invite} />
                    ))}
                    {invites.length === 0 && (
                        <p>You currently have no pending invites...</p>
                    )}
                </InvitesSurface>
            )}
        </>
    );
});

export default Invites;
