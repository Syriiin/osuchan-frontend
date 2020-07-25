import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import { SimpleModal, SimpleModalTitle, Button, Row, FormLabel, FormControl, TextField, LoadingSection, Flag } from "../../../components";
import { StoreContext } from "../../../store";
import { OsuUser } from "../../../store/models/profiles/types";
import { Invite } from "../../../store/models/leaderboards/types";
import { ResourceStatus } from "../../../store/status";

const InvitesList = styled.div`
    margin-top: 10px;
`;

const InviteeAvatar = styled.img`
    width: 50px;
    margin-right: 10px;
    border-radius: 5px;
`;

const FlagContainer = styled.div`
    margin-right: 10px;
`;

const InviteeUsername = styled.span`
    font-size: 1.5em;
    min-width: 200px;
    margin-right: 10px;
`;

const InviteMessage = styled.span`
    flex-grow: 1;
    max-width: 180px;
`;

const InviteRow = observer((props: InviteRowProps) => {
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;

    const osuUser = props.invite.osuUser as OsuUser;

    return (
        <Row>
            <InviteeAvatar src={`https://a.ppy.sh/${osuUser.id}`} />
            <FlagContainer>
                <Flag countryCode={osuUser.country} />
            </FlagContainer>
            <InviteeUsername>{osuUser.username}</InviteeUsername>
            <InviteMessage>{props.invite.message}</InviteMessage>
            <Button type="button" negative isLoading={detailStore.isCancellingInvite} action={() => detailStore.cancelInvite(osuUser.id)} confirmationMessage="Are you sure you want to cancel this invite?">Cancel Invite</Button>
        </Row>
    );
});

interface InviteRowProps {
    invite: Invite;
}

const InvitePlayerModal = (props: InvitePlayerModalProps) => {
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;

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
            detailStore.invitePlayers(userIds, inviteMessage);
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
}

const ManageInvitesModal = observer((props: ManageInvitesModalProps) => {
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;

    const { loadingInvitesStatus, leaderboard, invites, loadInvites } = detailStore;

    const open = props.open;
    useEffect(() => {
        if (open && leaderboard !== null) {
            loadInvites();
        }
    }, [open, leaderboard, loadInvites]);
    
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    return (
        <SimpleModal open={props.open} onClose={props.onClose}>
            <Helmet>
                {loadingInvitesStatus === ResourceStatus.Loading && (
                    <title>Loading...</title>
                )}
                {loadingInvitesStatus === ResourceStatus.Loaded && leaderboard && (
                    <title>Manage Invites - {leaderboard.name} - osu!chan</title>
                )}
                {loadingInvitesStatus === ResourceStatus.Error && (
                    <title>Leaderboard not found - osu!chan</title>
                )}
            </Helmet>
            <SimpleModalTitle>Manage Invites</SimpleModalTitle>

            <Button type="button" isLoading={detailStore.isInviting} action={() => setInviteModalOpen(true)}>Invite Player</Button>

            <InvitesList>
                {invites.map(invite => (
                    <InviteRow invite={invite} />
                ))}
            </InvitesList>

            {loadingInvitesStatus === ResourceStatus.Loaded && invites.length === 0 && (
                <p>There are no pending invites for this leaderboard...</p>
            )}

            {loadingInvitesStatus === ResourceStatus.Loading && (
                <LoadingSection />
            )}
            
            <InvitePlayerModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} />
        </SimpleModal>
    );
});

interface ManageInvitesModalProps {
    open: boolean;
    onClose: () => void;
}

export default ManageInvitesModal;
