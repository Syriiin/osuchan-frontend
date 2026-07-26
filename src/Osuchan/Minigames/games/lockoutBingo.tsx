import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
    FormControl,
    FormLabel,
    Select,
    ShortTimeAgo,
    SimpleModal,
    SimpleModalTitle,
    Surface,
    TextInput,
    Tooltip,
} from "../../../components";
import { ScoreModal } from "../../../components/layout/ScoreModal";
import type { Minigame, MinigameScore } from "../../../store/models/minigames/types";
import { useUpdateSettings } from "../../../store/minigames/api";
import { formatGameType, getTeamColor, getTeamColorDark } from "../formatting";
import { IconLeft, SettingsDescription, SettingsSubmit } from "../styledComponents";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import type { MinigameImplementation } from "./types";

interface BingoTask {
    id: number;
    type: string;
    params: Record<string, unknown>;
    description: string;
    row: number;
    col: number;
    completed_by_score_id: number | null;
    completed_by_player_id: number | null;
    completed_by_team_id: number | null;
}

const GameBoard = styled(Surface)`
    padding: 20px;
`;

const GameHeader = styled.div<{ $winner?: boolean }>`
    text-align: center;
    font-size: 1em;
    font-weight: 600;
    color: ${(props) => (props.$winner ? props.theme.colours.mango : "#fff")};
    background: ${(props) => props.theme.colours.foreground};
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 6px;
    ${(props) => (props.$winner ? `border: 2px solid ${props.theme.colours.mango};` : "")}
`;

const Grid = styled.div<{ $size: number }>`
    display: grid;
    grid-template-columns: repeat(${(props) => props.$size}, 1fr);
    gap: 6px;
`;

const Cell = styled.div<{
    $completed: boolean;
    $color?: string;
    $bgColor?: string;
    $gridSize: number;
}>`
    background-color: ${(props) => props.theme.colours.foreground};
    border: 2px solid
        ${(props) => (props.$completed && props.$bgColor ? props.$color : "transparent")};
    border-radius: 6px;
    padding: 6px 4px;
    font-size: ${(props) =>
        props.$gridSize === 3 ? "1em" : props.$gridSize === 5 ? "0.9em" : "0.8em"};
    display: flex;
    flex-direction: column;
    aspect-ratio: 1;
    overflow: hidden;
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease;
`;

const CellDescription = styled.span<{ $faded?: boolean; $small?: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.3;
    font-size: ${(props) => (props.$small ? "0.7em" : "0.9em")};
    opacity: ${(props) => (props.$faded ? 0.4 : 1)};
    overflow: hidden;
    word-break: break-word;
`;

const CellTeamBanner = styled.div<{ $color: string }>`
    background: ${(props) => props.$color};
    color: #fff;
    font-weight: bold;
    font-size: 1.1em;
    text-align: center;
    padding: 6px 6px;
    margin: -6px -4px 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
`;

const MiniScoreRow = styled.div<{ $hoverable?: boolean }>`
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 4px;
    margin-top: auto;
    width: 100%;
    font-size: 1.1em;
    color: #fff;
    overflow: hidden;
    border-radius: 4px;
    padding: 6px 6px;
    isolation: isolate;
    cursor: ${(props) => (props.$hoverable ? "pointer" : "default")};

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.15s;
        pointer-events: none;
        z-index: 2;
        border-radius: 4px;
    }

    &:hover::after {
        opacity: 1;
    }
`;

const MiniScoreRowBg = styled.div`
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.35);
    border-radius: 4px;
    z-index: 0;
`;

const MiniScoreRowContent = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    min-width: 0;
    z-index: 1;
`;

const MiniAvatar = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex-shrink: 0;
`;

const MiniPlayerName = styled.span`
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
`;

const MiniTimeAgo = styled.span`
    white-space: nowrap;
    flex-shrink: 0;
    opacity: 0.7;
    margin-left: auto;
`;

interface LockoutBingoGameProps {
    minigame: Minigame;
    scoringScores: MinigameScore[];
}

const LockoutBingoGame = (props: LockoutBingoGameProps) => {
    const { minigame, scoringScores } = props;
    const gridSize = (minigame.config.grid_size as number) ?? 3;
    const tasks = (minigame.state.tasks as BingoTask[]) ?? [];

    const scoringScoreById = useMemo(() => {
        const map = new Map<number, MinigameScore>();
        for (const ss of scoringScores) {
            map.set(ss.id, ss);
        }
        return map;
    }, [scoringScores]);

    const teamById = useMemo(() => {
        const sorted = [...minigame.teams].sort((a, b) => a.id - b.id);
        const map = new Map<number, { name: string; index: number }>();
        sorted.forEach((team, i) => {
            map.set(team.id, { name: team.name, index: i });
        });
        return map;
    }, [minigame.teams]);

    const sortedTasks = useMemo(
        () => [...tasks].sort((a, b) => a.row - b.row || a.col - b.col),
        [tasks],
    );

    const endTime = useMemo(() => {
        if (minigame.endTime !== null) return minigame.endTime;
        if (minigame.startTime === null) return null;
        const gameLen = (minigame.config.game_length as number) ?? 0;
        return new Date(minigame.startTime.getTime() + gameLen * 1000);
    }, [minigame.startTime, minigame.endTime, minigame.config.game_length]);

    const [remainingSeconds, setRemainingSeconds] = useState(0);

    useEffect(() => {
        if (endTime === null) return;
        const tick = () => {
            const remaining = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));
            setRemainingSeconds(remaining);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [endTime]);

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const winningTeam =
        minigame.winningTeamId !== null
            ? (minigame.teams.find((t) => t.id === minigame.winningTeamId) ?? null)
            : null;

    return (
        <GameBoard>
            <GameHeader $winner={winningTeam !== null}>
                {winningTeam !== null
                    ? `${winningTeam.name} wins!`
                    : `First to ${gridSize} in a row wins`}
                {endTime !== null && remainingSeconds > 0 && remainingSeconds < 1800 && (
                    <> — {formatTime(remainingSeconds)} remaining</>
                )}
            </GameHeader>
            <Grid $size={gridSize}>
                {sortedTasks.map((task) => {
                    const completed = task.completed_by_team_id !== null;
                    const teamInfo = completed
                        ? (teamById.get(task.completed_by_team_id!) ?? null)
                        : null;
                    const claimScore =
                        task.completed_by_score_id !== null
                            ? (scoringScoreById.get(task.completed_by_score_id) ?? null)
                            : null;
                    const isLongText = task.description.length > 60;

                    return (
                        <motion.div
                            key={task.id}
                            layout
                            transition={{ duration: 0.2, type: "tween", ease: "easeOut" }}
                        >
                            <Cell
                                $completed={completed}
                                $color={
                                    teamInfo !== null ? getTeamColor(teamInfo.index) : undefined
                                }
                                $bgColor={
                                    teamInfo !== null ? getTeamColorDark(teamInfo.index) : undefined
                                }
                                $gridSize={gridSize}
                            >
                                {teamInfo !== null && (
                                    <CellTeamBanner $color={getTeamColor(teamInfo.index)}>
                                        {teamInfo.name}
                                    </CellTeamBanner>
                                )}
                                <CellDescription $faded={completed} $small={isLongText}>
                                    {completed ? (
                                        <Tooltip content={task.description}>
                                            <span>{task.description}</span>
                                        </Tooltip>
                                    ) : (
                                        task.description
                                    )}
                                </CellDescription>
                                {claimScore !== null && (
                                    <MiniScoreRowModal claimScore={claimScore} />
                                )}
                            </Cell>
                        </motion.div>
                    );
                })}
            </Grid>
        </GameBoard>
    );
};

interface MiniScoreRowModalProps {
    claimScore: MinigameScore;
}

const MiniScoreRowModal = (props: MiniScoreRowModalProps) => {
    const { claimScore } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <MiniScoreRow $hoverable onClick={() => setOpen(true)}>
                <MiniScoreRowBg
                    style={{
                        backgroundImage: `url(https://assets.ppy.sh/beatmaps/${claimScore.score.beatmap!.setId}/covers/cover.jpg)`,
                    }}
                />
                <MiniScoreRowContent>
                    <MiniAvatar
                        src={`https://a.ppy.sh/${claimScore.score.userStats!.osuUserId}`}
                        alt=""
                    />
                    <MiniPlayerName>{claimScore.score.userStats!.osuUser!.username}</MiniPlayerName>
                    <MiniTimeAgo>
                        <ShortTimeAgo date={claimScore.score.date} />
                    </MiniTimeAgo>
                </MiniScoreRowContent>
            </MiniScoreRow>
            <ScoreModal score={claimScore.score} open={open} onClose={() => setOpen(false)} />
        </>
    );
};

interface LockoutBingoSettingsProps {
    open: boolean;
    onClose: () => void;
    minigame: Minigame;
}

const LockoutBingoSettings = (props: LockoutBingoSettingsProps) => {
    const { open, onClose, minigame } = props;
    const updateMutation = useUpdateSettings();

    const [gameLength, setGameLength] = useState((minigame.config.game_length as number) ?? 3600);
    const [gridSize, setGridSize] = useState((minigame.config.grid_size as number) ?? 3);

    useEffect(() => {
        setGameLength((minigame.config.game_length as number) ?? 3600);
        setGridSize((minigame.config.grid_size as number) ?? 3);
    }, [minigame.config.game_length, minigame.config.grid_size]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateMutation.mutateAsync({
            id: minigame.id,
            settings: { game_length: gameLength, grid_size: gridSize },
        });
        onClose();
    };

    return (
        <SimpleModal open={open} onClose={onClose}>
            <SimpleModalTitle>Settings</SimpleModalTitle>
            <SettingsDescription>Minigame: {formatGameType(minigame.gameType)}</SettingsDescription>
            <form onSubmit={handleSubmit}>
                <FormLabel>Game Length (seconds)</FormLabel>
                <TextInput
                    $fullWidth
                    type="number"
                    required
                    value={gameLength}
                    onChange={(e) => setGameLength(Number(e.currentTarget.value))}
                />

                <FormLabel>Grid Size</FormLabel>
                <FormControl>
                    <Select
                        value={gridSize}
                        onChange={(value) => setGridSize(value)}
                        options={[
                            { value: 3, label: "3×3" },
                            { value: 5, label: "5×5" },
                            { value: 7, label: "7×7" },
                        ]}
                    />
                </FormControl>

                <SettingsSubmit $positive type="submit" isLoading={updateMutation.isPending}>
                    <IconLeft icon={faCheck} fixedWidth /> Save
                </SettingsSubmit>
            </form>
        </SimpleModal>
    );
};

const lockoutBingo: MinigameImplementation = {
    gameType: "lockout_bingo",
    label: "Lockout Bingo",
    GameComponent: LockoutBingoGame,
    SettingsComponent: LockoutBingoSettings,
    defaultSettings: { game_length: 3600, grid_size: 3 },
};

export default lockoutBingo;
