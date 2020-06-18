import React, { useEffect, useContext, useState } from "react";
import { RouteComponentProps, Redirect } from "react-router";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { StoreContext } from "../../../store";
import { Surface, SurfaceTitle, Button, LoadingPage, SimpleModal, SimpleModalTitle, FormLabel, FormControl, TextField, Row } from "../../../components";
import { Invite, Leaderboard } from "../../../store/models/leaderboards/types";
import { OsuUser } from "../../../store/models/profiles/types";

const InvitesSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const InvitesList = styled.div`
    margin-top: 10px;
`;

const InviteeAvatar = styled.img`
    width: 50px;
    margin-right: 10px;
    border-radius: 5px;
`;

const InviteeUsername = styled.span`
    font-size: 1.5em;
    min-width: 200px;
    margin-right: 10px;
`;

const InviteMessage = styled.span`
    flex-grow: 1;
`;

const InviteRow = observer((props: InviteRowProps) => {
    const store = useContext(StoreContext);
    const invitesStore = store.leaderboardsStore.invitesStore;

    const osuUser = props.invite.osuUser as OsuUser;

    return (
        <Row>
            <InviteeAvatar src={`https://a.ppy.sh/${osuUser.id}`} />
            <InviteeUsername>{osuUser.username}</InviteeUsername>
            <InviteMessage>{props.invite.message}</InviteMessage>
            <Button type="button" negative isLoading={invitesStore.isCancellingInvite} action={() => invitesStore.cancelInvite(props.invite.leaderboardId, osuUser.id)} confirmationMessage="Are you sure you want to cancel this invite?">Cancel Invite</Button>
        </Row>
    );
});

interface InviteRowProps {
    invite: Invite;
}

const InvitePlayerModal = (props: InvitePlayerModalProps) => {
    const store = useContext(StoreContext);
    const invitesStore = store.leaderboardsStore.invitesStore;

    const [inviteUserUrl, setInviteUserUrl] = useState("");
    const [inviteMessage, setInviteMessage] = useState("");

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const userUrlRe = new RegExp(/osu.ppy.sh\/users\/(\d+)/, "g");
        let match;
        const userIds = [];
        while ((match = userUrlRe.exec(inviteUserUrl)) !== null) {
            userIds.push(parseInt(match[1]));
        }

        if (userIds.length > 0) {
            invitesStore.invitePlayers(props.leaderboard.id, userIds, inviteMessage);
            props.onClose();
        }
    }

    return (
        <SimpleModal open={props.open} onClose={props.onClose}>
            <SimpleModalTitle>Invite Players</SimpleModalTitle>
            <p>
                Enter osu!profile URLs to invite players.
                <br />
                URLs must be from the new site so they matches the format below.
            </p>
            <form onSubmit={handleInviteSubmit}>
                <FormLabel>osu! Profile URL(s)</FormLabel>
                <FormControl>
                    <TextField fullWidth required placeholder="https://osu.ppy.sh/users/5701575" onChange={e => setInviteUserUrl(e.currentTarget.value)} value={inviteUserUrl} />
                </FormControl>
                <FormLabel>Message</FormLabel>
                <FormControl>
                    <TextField fullWidth onChange={e => setInviteMessage(e.currentTarget.value)} value={inviteMessage} />
                </FormControl>
                <Button positive type="submit">Invite</Button>
            </form>
        </SimpleModal>
    );
};

interface InvitePlayerModalProps {
    open: boolean;
    onClose: () => void;
    leaderboard: Leaderboard;
}

const LeaderboardInvites = (props: LeaderboardInvitesProps) => {
    const store = useContext(StoreContext);
    const meStore = store.meStore;
    const invitesStore = store.leaderboardsStore.invitesStore;

    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const { loadInvites } = invitesStore;
    useEffect(() => {
        loadInvites(leaderboardId);
    }, [loadInvites, leaderboardId]);

    const leaderboard = invitesStore.leaderboard;

    // use effect to update title
    const { isLoading } = invitesStore;
    useEffect(() => {
        if (isLoading) {
            document.title = "Loading...";
        } else if (leaderboard) {
            document.title = `Manage Invites - ${leaderboard.name} - osu!chan`;
        } else {
            document.title = "Leaderboard not found - osu!chan";
        }
    }, [isLoading, leaderboard]);
    
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    return (
        <>
            {invitesStore.isLoading && (
                <LoadingPage />
            )}
            {leaderboard && leaderboard.ownerId === meStore.user?.osuUserId && (
                <InvitesSurface>
                    <SurfaceTitle onClick={() => console.log(invitesStore.invites.length)}>Manage Invites - {leaderboard.name}</SurfaceTitle>
                    
                    <Button type="button" isLoading={invitesStore.isInviting} action={() => setInviteModalOpen(true)}>Invite Player</Button>

                    <InvitesList>
                        {invitesStore.invites.map(invite => (
                            <InviteRow invite={invite} />
                        ))}
                    </InvitesList>
                    
                    <InvitePlayerModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} leaderboard={leaderboard} />
                </InvitesSurface>
            )}
            {!invitesStore.isLoading && !leaderboard && (
                <h3>Leaderboard not found!</h3>
            )}
            {!invitesStore.isLoading && leaderboard && leaderboard.ownerId !== meStore.user?.osuUserId && (
                <Redirect to={`/leaderboards/${leaderboard?.id}`} />
            )}
        </>
    );
}

interface RouteParams {
    leaderboardId: string;
}

interface LeaderboardInvitesProps extends RouteComponentProps<RouteParams> {}

export default observer(LeaderboardInvites);
