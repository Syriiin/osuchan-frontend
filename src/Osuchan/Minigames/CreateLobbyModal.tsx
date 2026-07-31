import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import {
    Button,
    FormControl,
    FormLabel,
    Select,
    SimpleModal,
    SimpleModalTitle,
    Switch,
    TextInput,
} from "../../components";
import { useCreateMinigame } from "../../store/minigames/api";
import { Gamemode } from "../../store/models/common/enums";
import { useStore } from "../../utils/hooks";
import registry from "./games/registry";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { IconLeft } from "./styledComponents";

const TeamInputRow = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 6px;
`;

const AddTeamButton = styled(Button)`
    margin-top: 4px;
    display: block;
`;

const FormSubmit = styled(Button)`
    margin-top: 20px;
`;

interface CreateLobbyModalProps {
    open: boolean;
    onClose: () => void;
}

const CreateLobbyModal = (props: CreateLobbyModalProps) => {
    const { open, onClose } = props;
    const navigate = useNavigate();
    const store = useStore();
    const meStore = store.meStore;
    const createMutation = useCreateMinigame();

    const [name, setName] = useState("");
    const [gameType, setGameType] = useState("lockout_bingo");
    const [gamemode, setGamemode] = useState(Gamemode.Standard);
    const [isFreeForAll, setIsFreeForAll] = useState(true);
    const [teamNames, setTeamNames] = useState(["Team 1", "Team 2"]);

    useEffect(() => {
        const user = meStore.user;
        if (open && user !== null && user !== undefined && user.osuUser !== null) {
            setName(`${user.osuUser.username}'s game`);
        }
    }, [open, meStore.user?.osuUser]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const impl = registry[gameType];
        const settings = impl?.defaultSettings ?? {};
        const minigame = await createMutation.mutateAsync({
            gameType: gameType,
            name,
            gamemode,
            isFreeForAll: isFreeForAll,
            teams: isFreeForAll ? [] : teamNames,
            settings,
        });
        onClose();
        void navigate(`/minigames/${minigame.id}`);
    };

    const handleTeamNameChange = (index: number, value: string) => {
        setTeamNames((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    const addTeam = () => setTeamNames((prev) => [...prev, `Team ${prev.length + 1}`]);

    const removeTeam = (index: number) => {
        if (teamNames.length > 2) {
            setTeamNames((prev) => prev.filter((_, i) => i !== index));
        }
    };

    return (
        <SimpleModal open={open} onClose={onClose}>
            <SimpleModalTitle>Create Lobby</SimpleModalTitle>
            <form onSubmit={handleSubmit}>
                <FormLabel>Name</FormLabel>
                <TextInput
                    $fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="My Minigame"
                />

                <FormLabel>Minigame</FormLabel>
                <FormControl>
                    <Select
                        value={gameType}
                        onChange={(value) => setGameType(value)}
                        options={Object.values(registry)
                            .filter((impl) => impl.gameType !== "first_to_n")
                            .map((impl) => ({
                                value: impl.gameType,
                                label: impl.label,
                            }))}
                    />
                </FormControl>

                <FormLabel>Gamemode</FormLabel>
                <FormControl>
                    <Select
                        value={gamemode}
                        onChange={(value) => setGamemode(value)}
                        options={[{ value: Gamemode.Standard, label: "osu!" }]}
                    />
                </FormControl>

                <FormLabel>Teams</FormLabel>
                <FormControl>
                    <Switch
                        mini
                        checked={!isFreeForAll}
                        onChange={(checked) => setIsFreeForAll(!checked)}
                    />
                </FormControl>

                {!isFreeForAll && (
                    <>
                        <FormLabel>Teams</FormLabel>
                        {teamNames.map((teamName, index) => (
                            <TeamInputRow key={index}>
                                <TextInput
                                    $fullWidth
                                    required
                                    value={teamName}
                                    onChange={(e) =>
                                        handleTeamNameChange(index, e.currentTarget.value)
                                    }
                                    placeholder={`Team ${index + 1}`}
                                />
                                {teamNames.length > 2 && (
                                    <Button
                                        type="button"
                                        $negative
                                        action={() => removeTeam(index)}
                                    >
                                        X
                                    </Button>
                                )}
                            </TeamInputRow>
                        ))}
                        <AddTeamButton type="button" action={addTeam}>
                            + Add Team
                        </AddTeamButton>
                    </>
                )}

                <FormSubmit $positive type="submit" isLoading={createMutation.isPending}>
                    <IconLeft icon={faPlus} fixedWidth /> Create Lobby
                </FormSubmit>
            </form>
        </SimpleModal>
    );
};

export default CreateLobbyModal;
