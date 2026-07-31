import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
    faArrowRightToBracket,
    faArrowRightFromBracket,
    faGear,
    faPlay,
    faTrashCan,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { Button, Label, LoadingSection, ShortTimeAgo, Surface } from "../../components";
import { ScoreModal } from "../../components/layout/ScoreModal";
import { ModIcons } from "../../components/layout/ModIcons";
import {
    useJoinMinigame,
    useLeaveMinigame,
    useStartMinigame,
    useMoveTeam,
    useDeleteMinigame,
} from "../../store/minigames/api";
import { MinigameStatus } from "../../store/models/minigames/types";
import type {
    Minigame as MinigameType,
    MinigameTeam,
    MinigamePlayer,
    MinigameScore,
} from "../../store/models/minigames/types";
import type { Score } from "../../store/models/profiles/types";
import { useStore } from "../../utils/hooks";
import { formatGamemodeName, gamemodeIcon } from "../../utils/formatting";
import SettingsModal from "./SettingsModal";
import CountdownTimer from "./CountdownTimer";
import GameScreen from "./GameScreen";
import { useCurrentGame } from "./CurrentGameContext";
import { formatGameType, getTeamColor, statusLabel } from "./formatting";
import { MetaItem, MetaIcon, GamemodeIcon, IconLeft } from "./styledComponents";

const LobbyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const HeaderCard = styled(Surface)`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const HeaderInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const GameName = styled.h2`
    margin: 0;
`;

const LobbyMetaRow = styled.div`
    display: flex;
    gap: 12px;
    font-size: 0.85em;
`;

const RightSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
`;

const StatusPill = styled.span<{ $positive?: boolean; $special?: boolean }>`
    font-size: 16px;
    font-weight: 700;
    padding: 8px 16px;
    border-radius: 20px;
    background-color: ${(props) => props.theme.colours.foreground};
    color: ${(props) =>
        props.$special
            ? props.theme.colours.mango
            : props.$positive
              ? props.theme.colours.positive
              : "#fff"};
`;

const ActionBar = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

const BodySection = styled.div`
    display: flex;
    gap: 20px;
    align-items: flex-start;
`;

const PlayerListColumn = styled.div`
    flex: 0 0 360px;
    min-width: 0;
`;

const GameAreaColumn = styled.div`
    flex: 1;
    min-width: 0;
`;

const ScoresColumn = styled.div`
    flex: 0 0 320px;
    min-width: 0;
`;

const ScoreFeed = styled(Surface)`
    padding: 15px;
`;

const ScoreRowWrapper = styled.div<{ $hoverable?: boolean }>`
    display: block;
    margin: 0 0 6px 0;
    padding: 0;
    border-radius: 5px;
    overflow: hidden;
    cursor: ${(props) => (props.$hoverable ? "pointer" : "default")};
    position: relative;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.15s;
        pointer-events: none;
        z-index: 2;
    }

    &:hover::after {
        opacity: 1;
    }
`;

const ScoreRowBg = styled.div`
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.35);
`;

const ScoreRowContent = styled.div`
    position: relative;
    z-index: 1;
    padding: 8px 10px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
`;

const ScoreRowInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
`;

const ScoreRowAvatar = styled.img`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    flex-shrink: 0;
`;

const ScoreRowName = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
`;

const ScoreRowTime = styled.span`
    flex-shrink: 0;
    color: #ccc;
    font-size: 0.85em;
`;

const ScoreRowBeatmap = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
    font-size: 0.85em;
    color: #ccc;
    margin-left: 36px;
`;

const ScoreRowMods = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 1px;
    height: 12px;
    flex-shrink: 0;
`;

const EmptyText = styled.span`
    color: gray;
    font-size: 0.85em;
`;

const ScoreFeedTitle = styled.h3`
    margin: 0 0 10px 0;
`;

const NoScoresText = styled.p`
    color: gray;
`;

const TeamsGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const TeamCard = styled(Surface)<{ $color?: string; $winner?: boolean }>`
    padding: 15px;
    ${(props) => (props.$color ? `border-left: 4px solid ${props.$color};` : "")}
    ${(props) =>
        props.$winner
            ? `background: ${props.theme.colours.mango}22; outline: 2px solid ${props.theme.colours.mango};`
            : ""}
`;

const FFACard = styled(Surface)`
    padding: 15px;
`;

const TeamHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const TeamName = styled.h3`
    margin: 0;
`;

const PlayerList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const PlayerRow = styled.div<{ $color?: string; $winner?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0 4px ${(props) => (props.$color ? "10px" : "0")};
    font-size: 0.9em;
    position: relative;

    ${(props) =>
        props.$color &&
        `
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 2px;
            bottom: 2px;
            width: 3px;
            border-radius: 2px;
            background: ${props.$color};
        }
    `}
    ${(props) =>
        props.$winner
            ? `border-radius: 4px; background: ${props.theme.colours.mango}22; outline: 1px solid ${props.theme.colours.mango};`
            : ""}
`;

const PlayerName = styled.span<{ $isHost?: boolean; $isSelf?: boolean }>`
    display: flex;
    align-items: center;
    ${(props) =>
        props.$isHost &&
        `
        color: ${props.theme.colours.mango};
    `}
    ${(props) =>
        props.$isSelf &&
        `
        color: ${props.theme.colours.positive};
        font-weight: 600;
    `}
`;

const HostLabel = styled(Label)`
    font-size: 0.7em;
    margin-left: 6px;
`;

const PlayerAvatar = styled.img`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colours.midground};
    margin-right: 8px;
`;

const PlayerPoints = styled.span`
    font-weight: 600;
    font-size: 0.9em;
    opacity: 0.7;
    margin-right: 4px;
`;

const TeamPoints = styled.span`
    font-weight: 600;
    font-size: 0.85em;
    opacity: 0.6;
    margin-left: 12px;
`;

const HostLine = styled.span`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.85em;
`;

const WinnerText = styled.span`
    color: ${(props) => props.theme.colours.mango};
    font-weight: 700;
    font-size: 0.95em;
    margin-left: 8px;
`;

const PointsWrapper = styled.span`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const TimerSection = styled.div`
    display: flex;
    justify-content: center;
`;

const statusColour = (status: MinigameStatus): string | undefined => {
    switch (status) {
        case MinigameStatus.Lobby:
            return undefined;
        case MinigameStatus.WaitingToStart:
            return "warning";
        case MinigameStatus.InProgress:
            return "positive";
        case MinigameStatus.Finalising:
            return "warning";
        case MinigameStatus.Finished:
            return undefined;
    }
};

interface LobbyScreenProps {
    minigame: MinigameType;
    scores: Score[];
    scoresLoading: boolean;
    scoringScores: MinigameScore[];
}

const LobbyScreen = observer((props: LobbyScreenProps) => {
    const { minigame, scores, scoresLoading, scoringScores } = props;
    const store = useStore();
    const meStore = store.meStore;
    const currentUserId = meStore.user?.osuUserId;

    const joinMutation = useJoinMinigame();
    const leaveMutation = useLeaveMinigame();
    const startMutation = useStartMinigame();
    const moveTeamMutation = useMoveTeam();
    const deleteMutation = useDeleteMinigame();

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [gameStartedLocally, setGameStartedLocally] = useState(false);

    useEffect(() => {
        setGameStartedLocally(false);
    }, [minigame.id]);

    const gameActive = (() => {
        if (gameStartedLocally) return true;
        if (
            minigame.status === MinigameStatus.InProgress ||
            minigame.status === MinigameStatus.Finalising ||
            minigame.status === MinigameStatus.Finished
        )
            return true;
        if (minigame.startTime !== null && minigame.startTime <= new Date()) {
            const gameLength = (minigame.config.game_length as number) ?? 3600;
            const endTime = new Date(minigame.startTime.getTime() + gameLength * 1000);
            if (new Date() < endTime) return true;
        }
        return false;
    })();

    const playerTeamId = currentUserId ? findPlayerTeam(minigame, currentUserId) : null;
    const isHost = currentUserId === minigame.host.id;
    const currentGame = useCurrentGame();
    const isInOtherGame = currentGame !== null && currentGame.id !== minigame.id;
    const canJoin =
        meStore.isAuthenticated &&
        playerTeamId === null &&
        !isInOtherGame &&
        (minigame.status === MinigameStatus.Lobby ||
            minigame.status === MinigameStatus.WaitingToStart);
    const couldJoin =
        !meStore.isAuthenticated &&
        playerTeamId === null &&
        !isInOtherGame &&
        (minigame.status === MinigameStatus.Lobby ||
            minigame.status === MinigameStatus.WaitingToStart);
    const canLeave =
        playerTeamId !== null &&
        (minigame.status === MinigameStatus.Lobby ||
            minigame.status === MinigameStatus.WaitingToStart);
    const canStart = isHost && minigame.status === MinigameStatus.Lobby;
    const winnerTeamId =
        minigame.status === MinigameStatus.Finished ? minigame.winningTeamId : null;

    const teamColorIndexById = useMemo(() => {
        const sorted = [...minigame.teams].sort((a, b) => a.id - b.id);
        const map = new Map<number, number>();
        sorted.forEach((team, i) => map.set(team.id, i));
        return map;
    }, [minigame.teams]);

    return (
        <>
            <title>{`${minigame.name} - osu!chan`}</title>
            <LobbyWrapper>
                <HeaderCard>
                    <HeaderInfo>
                        <TitleRow>
                            <GameName>{minigame.name}</GameName>
                        </TitleRow>
                        <HostLine>Host: {minigame.host.username}</HostLine>
                        <LobbyMetaRow>
                            <MetaItem>
                                <GamemodeIcon src={gamemodeIcon(minigame.gamemode)} alt="" />
                                {formatGamemodeName(minigame.gamemode)}
                            </MetaItem>
                            <MetaItem>
                                <MetaIcon icon={minigame.isFreeForAll ? faUser : faUsers} />
                                {minigame.isFreeForAll ? "Free for All" : "Teams"}
                            </MetaItem>
                            <MetaItem>{formatGameType(minigame.gameType)}</MetaItem>
                        </LobbyMetaRow>
                    </HeaderInfo>

                    <RightSection>
                        <StatusPill
                            $positive={statusColour(minigame.status) === "positive"}
                            $special={statusColour(minigame.status) === "warning"}
                        >
                            {statusLabel(minigame.status)}
                        </StatusPill>
                        <ActionBar>
                            {canJoin && (
                                <Button
                                    isLoading={joinMutation.isPending}
                                    action={() => joinMutation.mutate(minigame.id)}
                                >
                                    <IconLeft icon={faArrowRightToBracket} fixedWidth /> Join
                                </Button>
                            )}
                            {couldJoin && (
                                <a href="/osuauth/login">
                                    <Button>
                                        <IconLeft icon={faArrowRightToBracket} fixedWidth /> Login
                                        to join
                                    </Button>
                                </a>
                            )}
                            {canLeave && (
                                <Button
                                    $negative
                                    isLoading={leaveMutation.isPending}
                                    action={() => leaveMutation.mutate(minigame.id)}
                                >
                                    <IconLeft icon={faArrowRightFromBracket} fixedWidth /> Leave
                                </Button>
                            )}
                            {canStart && (
                                <Button
                                    $positive
                                    isLoading={startMutation.isPending}
                                    action={() =>
                                        startMutation.mutate({ id: minigame.id, countdown: 10 })
                                    }
                                >
                                    <IconLeft icon={faPlay} fixedWidth /> Start
                                </Button>
                            )}
                            {isHost && minigame.status === MinigameStatus.Lobby && (
                                <>
                                    <Button
                                        $negative
                                        isLoading={deleteMutation.isPending}
                                        action={() => deleteMutation.mutate(minigame.id)}
                                    >
                                        <IconLeft icon={faTrashCan} fixedWidth /> Delete
                                    </Button>
                                    <Button action={() => setSettingsOpen(true)}>
                                        <IconLeft icon={faGear} fixedWidth /> Settings
                                    </Button>
                                </>
                            )}
                        </ActionBar>
                    </RightSection>
                </HeaderCard>

                <BodySection>
                    <PlayerListColumn>
                        {minigame.isFreeForAll ? (
                            <FFACard>
                                <PlayerList>
                                    {[...minigame.teams]
                                        .sort((a, b) => {
                                            const aPts = a.players[0]?.points ?? 0;
                                            const bPts = b.players[0]?.points ?? 0;
                                            return bPts - aPts;
                                        })
                                        .map((t: MinigameTeam) => {
                                            const player = t.players[0];
                                            if (player === undefined) return null;
                                            return (
                                                <PlayerRow
                                                    key={player.id}
                                                    $color={getTeamColor(
                                                        teamColorIndexById.get(t.id)!,
                                                    )}
                                                    $winner={winnerTeamId === t.id}
                                                >
                                                    <PlayerName
                                                        $isHost={
                                                            player.user.id === minigame.host.id
                                                        }
                                                        $isSelf={player.user.id === currentUserId}
                                                    >
                                                        <PlayerAvatar
                                                            src={`https://a.ppy.sh/${player.user.id}`}
                                                            alt=""
                                                        />
                                                        {player.user.username}
                                                        {player.user.id === minigame.host.id && (
                                                            <HostLabel $special>Host</HostLabel>
                                                        )}
                                                    </PlayerName>
                                                    <PointsWrapper>
                                                        {winnerTeamId === t.id && (
                                                            <WinnerText>Winner</WinnerText>
                                                        )}
                                                        {gameActive && (
                                                            <PlayerPoints>
                                                                {player.points} pts
                                                            </PlayerPoints>
                                                        )}
                                                    </PointsWrapper>
                                                </PlayerRow>
                                            );
                                        })}
                                    {minigame.teams.flatMap((t: MinigameTeam) => t.players)
                                        .length === 0 && <EmptyText>No players yet</EmptyText>}
                                </PlayerList>
                            </FFACard>
                        ) : (
                            <TeamsGrid>
                                {minigame.teams.map((team: MinigameTeam) => {
                                    const isUsersTeam = currentUserId
                                        ? team.players.some(
                                              (p: MinigamePlayer) => p.user.id === currentUserId,
                                          )
                                        : false;

                                    return (
                                        <TeamCard
                                            key={team.id}
                                            $color={getTeamColor(teamColorIndexById.get(team.id)!)}
                                            $winner={winnerTeamId === team.id}
                                        >
                                            <TeamHeader>
                                                <TeamName>
                                                    {team.name}
                                                    {gameActive && (
                                                        <TeamPoints>{team.points} pts</TeamPoints>
                                                    )}
                                                    {winnerTeamId === team.id && (
                                                        <WinnerText>Winner</WinnerText>
                                                    )}
                                                </TeamName>
                                                {currentUserId !== undefined &&
                                                    !isUsersTeam &&
                                                    playerTeamId !== null &&
                                                    minigame.status === MinigameStatus.Lobby && (
                                                        <Button
                                                            action={() =>
                                                                moveTeamMutation.mutate({
                                                                    id: minigame.id,
                                                                    teamId: team.id,
                                                                })
                                                            }
                                                            isLoading={moveTeamMutation.isPending}
                                                        >
                                                            Switch here
                                                        </Button>
                                                    )}
                                            </TeamHeader>
                                            <PlayerList>
                                                {[...team.players]
                                                    .sort((a, b) => b.points - a.points)
                                                    .map((player: MinigamePlayer) => (
                                                        <PlayerRow
                                                            key={player.id}
                                                            $color={getTeamColor(
                                                                teamColorIndexById.get(team.id)!,
                                                            )}
                                                        >
                                                            <PlayerName
                                                                $isHost={
                                                                    player.user.id ===
                                                                    minigame.host.id
                                                                }
                                                                $isSelf={
                                                                    player.user.id === currentUserId
                                                                }
                                                            >
                                                                <PlayerAvatar
                                                                    src={`https://a.ppy.sh/${player.user.id}`}
                                                                    alt=""
                                                                />
                                                                {player.user.username}
                                                                {player.user.id ===
                                                                    minigame.host.id && (
                                                                    <HostLabel $special>
                                                                        Host
                                                                    </HostLabel>
                                                                )}
                                                            </PlayerName>
                                                            {gameActive && (
                                                                <PlayerPoints>
                                                                    {player.points} pts
                                                                </PlayerPoints>
                                                            )}
                                                        </PlayerRow>
                                                    ))}
                                                {team.players.length === 0 && (
                                                    <EmptyText>No players yet</EmptyText>
                                                )}
                                            </PlayerList>
                                        </TeamCard>
                                    );
                                })}
                            </TeamsGrid>
                        )}
                    </PlayerListColumn>

                    <GameAreaColumn>
                        {minigame.status === MinigameStatus.WaitingToStart &&
                            minigame.startTime !== null &&
                            !gameActive && (
                                <TimerSection>
                                    <CountdownTimer
                                        target={minigame.startTime}
                                        label="Starting in"
                                        onExpired={() => setGameStartedLocally(true)}
                                    />
                                </TimerSection>
                            )}
                        {gameActive && (
                            <GameScreen minigame={minigame} scoringScores={scoringScores} />
                        )}
                    </GameAreaColumn>

                    <ScoresColumn>
                        {gameActive && (
                            <ScoreFeed>
                                <ScoreFeedTitle>Recent Scores</ScoreFeedTitle>
                                {scoresLoading && <LoadingSection />}
                                {!scoresLoading && scores.length === 0 && (
                                    <NoScoresText>No scores yet.</NoScoresText>
                                )}
                                {!scoresLoading && scores.length > 0 && (
                                    <div>
                                        {scores.slice(0, 10).map((score) => (
                                            <motion.div
                                                key={score.id}
                                                layout
                                                initial={{ x: 300 }}
                                                animate={{ x: 0 }}
                                                transition={{
                                                    x: { duration: 0.3, ease: "easeOut" },
                                                }}
                                            >
                                                <ScoreRow score={score} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </ScoreFeed>
                        )}
                    </ScoresColumn>
                </BodySection>
            </LobbyWrapper>

            <SettingsModal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                minigame={minigame}
            />
        </>
    );
});

interface ScoreRowProps {
    score: Score;
}

const ScoreRow = observer((props: ScoreRowProps) => {
    const { score } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <ScoreRowWrapper $hoverable onClick={() => setOpen(true)}>
                <ScoreRowBg
                    style={{
                        backgroundImage: `url(https://assets.ppy.sh/beatmaps/${score.beatmap!.setId}/covers/cover.jpg)`,
                    }}
                />
                <ScoreRowContent>
                    <ScoreRowInfo>
                        <ScoreRowAvatar
                            src={`https://a.ppy.sh/${score.userStats!.osuUserId}`}
                            alt=""
                        />
                        <ScoreRowName>
                            <strong>{score.userStats!.osuUser!.username}</strong>
                        </ScoreRowName>
                        <ScoreRowTime>
                            <ShortTimeAgo date={score.date} />
                        </ScoreRowTime>
                    </ScoreRowInfo>
                    <ScoreRowInfo>
                        <ScoreRowBeatmap>
                            {score.beatmap!.artist} - {score.beatmap!.title} [
                            {score.beatmap!.difficultyName}]
                        </ScoreRowBeatmap>
                        <ScoreRowMods>
                            <ModIcons small mods={score.modsJson} />
                        </ScoreRowMods>
                    </ScoreRowInfo>
                </ScoreRowContent>
            </ScoreRowWrapper>
            <ScoreModal score={score} open={open} onClose={() => setOpen(false)} />
        </>
    );
});

function findPlayerTeam(minigame: MinigameType, userId: number): number | null {
    for (const team of minigame.teams) {
        if (team.players.some((p) => p.user.id === userId)) {
            return team.id;
        }
    }
    return null;
}

export default LobbyScreen;
