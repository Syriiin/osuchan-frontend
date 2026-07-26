import React, { useState } from "react";
import { observer } from "mobx-react-lite";

import {
    SimpleModal,
    SimpleModalTitle,
    FormLabel,
    FormControl,
    TextInput,
    Select,
    Button,
} from "../../../components";
import { Gamemode } from "../../../store/models/common/enums";
import { useStore } from "../../../utils/hooks";

const CHALLENGE_TYPES = [
    { value: "best_combo", label: "Best Combo" },
    { value: "lowest_miss_count", label: "Lowest Miss Count" },
];

const CreateChallengeModal = observer((props: CreateChallengeModalProps) => {
    const store = useStore();
    const eventsStore = store.eventsStore;

    const [beatmapId, setBeatmapId] = useState("");
    const [description, setDescription] = useState("");
    const [gamemode, setGamemode] = useState(Gamemode.Standard);
    const [challengeType, setChallengeType] = useState("best_combo");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedBeatmapId = parseInt(beatmapId);
        if (isNaN(parsedBeatmapId)) return;

        eventsStore.createChallenge(props.slug, {
            beatmap_id: parsedBeatmapId,
            description,
            gamemode,
            challenge_type: challengeType,
        });
        props.onClose();
    };

    return (
        <SimpleModal open={props.open} onClose={props.onClose} keepMounted>
            <SimpleModalTitle>Create Challenge</SimpleModalTitle>
            <form onSubmit={handleSubmit}>
                <FormLabel>Beatmap ID</FormLabel>
                <TextInput
                    $fullWidth
                    required
                    type="text"
                    placeholder="362949"
                    value={beatmapId}
                    onChange={(e) => {
                        const val = e.currentTarget.value;
                        if (/^\d*$/.test(val)) {
                            setBeatmapId(val);
                        }
                    }}
                />
                <FormLabel>Description</FormLabel>
                <TextInput
                    $fullWidth
                    required
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                />
                <FormLabel>Gamemode</FormLabel>
                <FormControl>
                    <Select
                        value={gamemode}
                        onChange={(value) => setGamemode(value)}
                        options={[
                            { value: Gamemode.Standard, label: "osu!" },
                            { value: Gamemode.Taiko, label: "osu!taiko" },
                            { value: Gamemode.Catch, label: "osu!catch" },
                            { value: Gamemode.Mania, label: "osu!mania" },
                        ]}
                    />
                </FormControl>
                <FormLabel>Challenge Type</FormLabel>
                <FormControl>
                    <Select
                        value={challengeType}
                        onChange={(value) => setChallengeType(value)}
                        options={CHALLENGE_TYPES}
                    />
                </FormControl>
                <Button $positive type="submit" isLoading={eventsStore.isCreatingChallenge}>
                    Create
                </Button>
            </form>
        </SimpleModal>
    );
});

interface CreateChallengeModalProps {
    open: boolean;
    onClose: () => void;
    slug: string;
}

export default CreateChallengeModal;
