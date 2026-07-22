import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { LoadingPage } from "../../components";
import {
    useMinigame,
    useMinigameRecentScores,
    useMinigameScoringScores,
} from "../../store/minigames/api";
import LobbyScreen from "./LobbyScreen";
import { AxiosError } from "axios";

const MinigameDetail = observer(() => {
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const id = parseInt(params.id!);

    const { data: minigame, isLoading, isError, error } = useMinigame(id);

    useEffect(() => {
        if (error instanceof AxiosError && error.response?.status === 404) {
            void navigate("/minigames");
        }
    }, [error, navigate]);

    const { data: scores, isLoading: scoresLoading } = useMinigameRecentScores(
        id,
        minigame?.status ?? null,
    );

    const { data: scoringScores } = useMinigameScoringScores(id, minigame?.status ?? null);

    if (isLoading) return <LoadingPage />;
    if (isError || minigame === undefined) return null;

    return (
        <LobbyScreen
            minigame={minigame}
            scores={scores ?? []}
            scoresLoading={scoresLoading}
            scoringScores={scoringScores ?? []}
        />
    );
});

export default MinigameDetail;
