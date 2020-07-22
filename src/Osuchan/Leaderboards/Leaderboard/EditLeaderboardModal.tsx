import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

import { SimpleModal, SimpleModalTitle, FormLabel, TextInput, FormControl, Select, TextField, Button } from "../../../components";
import { StoreContext } from "../../../store";
import { LeaderboardAccessType } from "../../../store/models/leaderboards/enums";

const LeaderboardIcon = styled.img`
    max-width: 128px;
    max-height: 128px;
    border-radius: 5px;
`;

const EditLeaderboardModal = observer((props: EditLeaderboardModalProps) => {
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;

    const { leaderboard } = detailStore;
    
    const [accessType, setAccessType] = useState(leaderboard?.accessType ?? LeaderboardAccessType.Public);
    const [name, setName] = useState(leaderboard?.name ?? "");
    const [description, setDescription] = useState(leaderboard?.description ?? "");
    const [iconUrl, setIconUrl] = useState(leaderboard?.iconUrl ?? "");

    // Timeout updated icon url so we don't spam preview image requests on every character change
    const [delayedIconUrl, setDelayedIconUrl] = useState(iconUrl);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDelayedIconUrl(iconUrl);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [setDelayedIconUrl, iconUrl]);

    const handleUpdateLeaderboardSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        detailStore.updateLeaderboard({
            accessType,
            name,
            description,
            iconUrl
        });
    }

    return (
        <SimpleModal open={props.open} onClose={props.onClose}>
            <SimpleModalTitle>Edit Leaderboard</SimpleModalTitle>
            <form onSubmit={handleUpdateLeaderboardSubmit}>
                {/* Basic details */}
                <FormLabel>Name</FormLabel>
                <TextInput fullWidth required value={name} onChange={e => setName(e.currentTarget.value)} />
                <FormLabel>Type</FormLabel>
                <FormControl>
                    <Select value={accessType} onChange={value => setAccessType(value)} options={[
                        { value: LeaderboardAccessType.Public, label: "Public" },
                        { value: LeaderboardAccessType.PublicInviteOnly, label: "Public (Invite-only)" },
                        { value: LeaderboardAccessType.Private, label: "Private" }
                    ]} />
                </FormControl>
                <FormLabel>Description</FormLabel>
                <TextField fullWidth value={description} onChange={e => setDescription(e.currentTarget.value)} />
                <FormLabel>Icon URL</FormLabel>
                <FormControl>
                    <TextInput fullWidth placeholder={`${window.location.origin}/static/icon-64.png`} value={iconUrl} onChange={e => setIconUrl(e.currentTarget.value)} />
                    <LeaderboardIcon src={delayedIconUrl} />
                </FormControl>

                <Button isLoading={detailStore.isUpdatingLeaderboard} type="submit">Update</Button>
            </form>
        </SimpleModal>
    );
});

interface EditLeaderboardModalProps {
    open: boolean;
    onClose: () => void;
}

export default EditLeaderboardModal;
