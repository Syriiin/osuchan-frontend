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
import { BitMods, Gamemode } from "../../../store/models/common/enums";
import { AllowedBeatmapStatus, ScoreSet } from "../../../store/models/profiles/enums";
import { useStore } from "../../../utils/hooks";

const CreateLeaderboardModal = observer(
    (props: CreateLeaderboardModalProps) => {
        const store = useStore();
        const eventsStore = store.eventsStore;

        const [gamemode, setGamemode] = useState(Gamemode.Standard);
        const [name, setName] = useState("");

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();

            eventsStore.createLeaderboard(props.slug, {
                gamemode,
                name,
                score_set: ScoreSet.Normal,
                score_filter: {
                    allowed_beatmap_status: AllowedBeatmapStatus.RankedOnly,
                    required_mods: BitMods.None,
                    disqualified_mods: BitMods.None,
                },
            });
            props.onClose();
        };

        return (
            <SimpleModal open={props.open} onClose={props.onClose}>
                <SimpleModalTitle>Create Leaderboard</SimpleModalTitle>
                <form onSubmit={handleSubmit}>
                    <FormLabel>Name</FormLabel>
                    <TextInput
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
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

                    <Button
                        positive
                        type="submit"
                        isLoading={eventsStore.isCreatingLeaderboard}
                    >
                        Create
                    </Button>
                </form>
            </SimpleModal>
        );
    }
);

interface CreateLeaderboardModalProps {
    open: boolean;
    onClose: () => void;
    slug: string;
}

export default CreateLeaderboardModal;
