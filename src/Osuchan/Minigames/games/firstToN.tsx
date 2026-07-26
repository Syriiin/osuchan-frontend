import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FormLabel, SimpleModal, SimpleModalTitle, Surface, TextInput } from "../../../components";
import { MinigameStatus } from "../../../store/models/minigames/types";
import type { Minigame, MinigameScore } from "../../../store/models/minigames/types";
import { useUpdateSettings } from "../../../store/minigames/api";
import CountdownTimer from "../CountdownTimer";
import { formatGameType } from "../formatting";
import { IconLeft, SettingsDescription, SettingsSubmit } from "../styledComponents";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import type { MinigameImplementation } from "./types";

const GameBoard = styled(Surface)`
    padding: 20px;
`;

const TimerSection = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const TeamList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TeamItem = styled.div<{ $winner?: boolean }>`
    padding: 15px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colours.foreground};
    transition:
        box-shadow 0.3s ease,
        border-color 0.3s ease;
    ${(props) =>
        props.$winner &&
        `
        border: 2px solid ${props.theme.colours.positive};
        box-shadow: 0 0 10px ${props.theme.colours.positive}44;
    `}
`;

const TeamRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TeamName = styled.h3`
    margin: 0;
`;

const ScoreCount = styled.span`
    font-size: 1.2em;
    font-weight: bold;
`;

const ProgressBarBackground = styled.div`
    flex: 1;
    width: 100%;
    height: 16px;
    background-color: ${(props) => props.theme.colours.midground};
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
`;

const ProgressBarFill = styled.div<{ $percent: number; $winner?: boolean }>`
    width: ${(props) => Math.min(props.$percent, 100)}%;
    height: 100%;
    background-color: ${(props) =>
        props.$winner ? props.theme.colours.positive : props.theme.colours.pillow};
    border-radius: 8px;
    transition: width 0.5s ease;
`;

const WinnerBanner = styled.div`
    text-align: center;
    padding: 20px;
    background-color: ${(props) => props.theme.colours.positive}22;
    border: 2px solid ${(props) => props.theme.colours.positive};
    border-radius: 8px;
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 20px;
`;

const FinalisingText = styled.span`
    font-size: 1.2em;
    color: gray;
`;

function getScoresToWin(minigame: Minigame): number {
    return (minigame.config.scores_to_win as number) ?? 10;
}

interface FirstToNGameProps {
    minigame: Minigame;
    scoringScores: MinigameScore[];
}

const FirstToNGame = (props: FirstToNGameProps) => {
    const { minigame } = props;
    const scoresToWin = getScoresToWin(minigame);
    const winningTeam =
        minigame.winningTeamId !== null
            ? (minigame.teams.find((t) => t.id === minigame.winningTeamId) ?? null)
            : null;

    const sortedTeams = [...minigame.teams].sort((a, b) => b.points - a.points);

    const showEndTimer = minigame.status === MinigameStatus.InProgress && minigame.endTime !== null;

    const endTime = minigame.endTime;

    const gameEnded = endTime !== null && new Date() >= endTime;

    const showFinalising =
        minigame.status === MinigameStatus.Finalising ||
        (gameEnded && minigame.status !== MinigameStatus.Finished);

    return (
        <GameBoard>
            {winningTeam !== null && <WinnerBanner>{winningTeam.name} wins!</WinnerBanner>}
            {minigame.status === MinigameStatus.Finished && winningTeam === null && gameEnded && (
                <WinnerBanner>Tie! - Timer expired</WinnerBanner>
            )}

            {showEndTimer && endTime !== null && (
                <TimerSection>
                    <CountdownTimer target={endTime} label="Time remaining" />
                </TimerSection>
            )}

            {showFinalising && (
                <TimerSection>
                    <FinalisingText>Finalising scores...</FinalisingText>
                </TimerSection>
            )}

            <TeamList>
                {sortedTeams.map((team) => {
                    const isWinning = winningTeam?.id === team.id;
                    const progressPercent = scoresToWin > 0 ? (team.points / scoresToWin) * 100 : 0;

                    return (
                        <motion.div
                            key={team.id}
                            layout
                            transition={{ duration: 0.3, type: "tween", ease: "easeOut" }}
                        >
                            <TeamItem $winner={isWinning}>
                                <TeamRow>
                                    <TeamName>{team.name}</TeamName>
                                    <ScoreCount>
                                        {team.points}
                                        {scoresToWin > 0 && <span>/{scoresToWin}</span>}
                                    </ScoreCount>
                                </TeamRow>

                                <TeamRow>
                                    {scoresToWin > 0 && (
                                        <ProgressBarBackground>
                                            <ProgressBarFill
                                                $percent={progressPercent}
                                                $winner={isWinning}
                                            />
                                        </ProgressBarBackground>
                                    )}
                                </TeamRow>
                            </TeamItem>
                        </motion.div>
                    );
                })}
            </TeamList>
        </GameBoard>
    );
};

interface FirstToNSettingsProps {
    open: boolean;
    onClose: () => void;
    minigame: Minigame;
}

const FirstToNSettings = (props: FirstToNSettingsProps) => {
    const { open, onClose, minigame } = props;
    const updateMutation = useUpdateSettings();

    const [gameLength, setGameLength] = useState((minigame.config.game_length as number) ?? 3600);
    const [scoresToWin, setScoresToWin] = useState((minigame.config.scores_to_win as number) ?? 10);

    useEffect(() => {
        setGameLength((minigame.config.game_length as number) ?? 3600);
        setScoresToWin((minigame.config.scores_to_win as number) ?? 10);
    }, [minigame.config.game_length, minigame.config.scores_to_win]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateMutation.mutateAsync({
            id: minigame.id,
            settings: { game_length: gameLength, scores_to_win: scoresToWin },
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

                <FormLabel>Scores to Win</FormLabel>
                <TextInput
                    $fullWidth
                    type="number"
                    required
                    value={scoresToWin}
                    onChange={(e) => setScoresToWin(Number(e.currentTarget.value))}
                />

                <SettingsSubmit $positive type="submit" isLoading={updateMutation.isPending}>
                    <IconLeft icon={faCheck} fixedWidth /> Save
                </SettingsSubmit>
            </form>
        </SimpleModal>
    );
};

const firstToN: MinigameImplementation = {
    gameType: "first_to_n",
    label: "First to N",
    GameComponent: FirstToNGame,
    SettingsComponent: FirstToNSettings,
    defaultSettings: { game_length: 3600, scores_to_win: 10 },
};

export default firstToN;
