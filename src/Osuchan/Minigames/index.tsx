import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router";
import { useMinigameHistory } from "../../store/minigames/api";
import { MinigameStatus } from "../../store/models/minigames/types";
import { useStore } from "../../utils/hooks";
import { CurrentGameProvider } from "./CurrentGameContext";
import MinigameDetail from "./MinigameDetail";
import MinigameHistory from "./MinigameHistory";
import MinigameList from "./MinigameList";

const MinigamesRoot = observer(() => {
    const store = useStore();
    const currentUserId = store.meStore.user?.osuUserId;
    const { data: history } = useMinigameHistory();

    const currentGame =
        (history ?? []).find(
            (minigame) =>
                minigame.status !== MinigameStatus.Finished &&
                minigame.teams.some((t) => t.players.some((p) => p.user.id === currentUserId)),
        ) ?? null;

    return (
        <CurrentGameProvider value={currentGame}>
            <Routes>
                <Route path="/" element={<MinigameList />} />
                <Route path="history" element={<MinigameHistory />} />
                <Route path=":id" element={<MinigameDetail />} />
            </Routes>
        </CurrentGameProvider>
    );
});

export default MinigamesRoot;
