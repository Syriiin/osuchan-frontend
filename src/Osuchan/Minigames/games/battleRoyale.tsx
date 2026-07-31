import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
    Button,
    FormLabel,
    Label,
    ModIcons,
    SimpleModal,
    SimpleModalTitle,
    Surface,
    TextInput,
    Tooltip,
} from "../../../components";
import { ModsSelect } from "../../../components/forms/ModsSelect";
import { MinigameStatus } from "../../../store/models/minigames/types";
import type { Minigame, MinigameScore, MinigameTeam } from "../../../store/models/minigames/types";
import type { Beatmap, ModsJson } from "../../../store/models/profiles/types";
import { useBeatmaps } from "../../../store/profiles/api";
import { useUpdateSettings } from "../../../store/minigames/api";
import { modAcronymsFromJsonMods, modsJsonFromModAcronyms } from "../../../utils/osu";
import CountdownTimer from "../CountdownTimer";
import { formatGameType } from "../formatting";
import { IconLeft, SettingsDescription, SettingsSubmit } from "../styledComponents";
import { faCheck, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import type { MinigameImplementation } from "./types";

interface BattleRoyaleRound {
    beatmap_id: number;
    allowed_mods: string[];
    target_teams: number;
    round_start: string;
    cutoff_time: string;
    player_scores: Record<number, number>;
    team_scores: Record<number, number>;
    eliminated_team_ids: number[];
}

interface BattleRoyaleState {
    rounds: BattleRoyaleRound[];
    active_team_ids: number[];
    eliminated_team_ids: number[];
    team_player_map: Record<number, number[]>;
}

const GameBoard = styled(Surface)`
    padding: 20px;
`;

const RoundCard = styled.div`
    position: relative;
    padding: 15px;
    border-radius: 8px;
    background-color: ${(props) => props.theme.colours.foreground};
    margin-bottom: 20px;
    overflow: hidden;
`;

const RoundCardBanner = styled.div<{ $bleed?: boolean }>`
    position: relative;
    margin: ${(props) => (props.$bleed ? "-15px" : "-15px -15px 0")};
    padding: 15px;
    background-size: cover;
    background-position: center;
    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
    }
`;

const RoundCardBannerContent = styled.div`
    position: relative;
    z-index: 1;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
`;

const TimerSection = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    padding-top: 15px;
    margin: 0 -15px -15px;
    overflow: hidden;
`;

const TimerContent = styled.div`
    position: relative;
    z-index: 1;
`;

const TimerProgress = styled.div<{ $progress: number }>`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: ${(props) => `${props.$progress * 100}%`};
    background-color: ${(props) => props.theme.colours.mango};
    opacity: 0.25;
    transition: width 1s linear;
`;

const RoundTitle = styled.h3`
    margin: 0 0 4px 0;
`;

const BeatmapLine = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95em;
`;

const BeatmapMods = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 3px 8px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.5);
`;

const BeatmapModsInner = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 16px;
`;

const FreeModLabel = styled.span`
    font-size: 0.7em;
    text-transform: uppercase;
    letter-spacing: 0.08em;
`;

const BeatmapId = styled.span`
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 0.75em;
    opacity: 0.5;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95);
`;

const FinalisingBanner = styled.div`
    text-align: center;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: ${(props) => props.theme.colours.foreground};
    border: 1px solid ${(props) => props.theme.colours.timber}44;
    font-size: 1.1em;
    color: gray;
`;

const StandingsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const StandingRow = styled.div<{ $eliminated?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colours.background};
    opacity: ${(props) => (props.$eliminated ? 0.5 : 1)};
    text-decoration: ${(props) => (props.$eliminated ? "line-through" : "none")};
`;

const StandingScore = styled.span`
    font-weight: bold;
`;

const SectionTitle = styled.h4`
    margin: 20px 0 10px 0;
`;

const SectionTitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
`;

const TimelineList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const TimelineRow = styled.div<{
    $live?: boolean;
    $complete?: boolean;
    $selected?: boolean;
}>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colours.foreground};
    border-left: 4px solid
        ${(props) =>
            props.$live
                ? props.theme.colours.positive
                : props.$selected
                  ? props.theme.colours.mango
                  : props.theme.colours.midground};
    opacity: ${(props) => (props.$complete && !props.$selected ? 0.5 : 1)};
    cursor: pointer;

    &:hover {
        filter: brightness(1.15);
    }
`;

const BannerMetaRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
`;

const RoundStatusBadge = styled(Label)<{
    $status: "live" | "upcoming" | "complete";
}>`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    margin: 0;
    padding: 6px 14px;
    font-size: 0.7em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 0 0 0 8px;
    background-color: ${(props) =>
        props.$status === "live"
            ? props.theme.colours.positive
            : props.$status === "upcoming"
              ? props.theme.colours.warning
              : props.theme.colours.timber};
    color: #fff;
`;

const EliminatedSummary = styled.p`
    margin-top: 10px;
    font-size: 0.85em;
    color: gray;
`;

const EmptyState = styled.p`
    text-align: center;
    color: gray;
    padding: 20px;
`;

const TimelineBeatmap = styled.span`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9em;
`;

const TimelineMeta = styled.span`
    flex-shrink: 0;
    font-size: 0.8em;
    opacity: 0.7;
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

function ts(iso: string): number {
    return new Date(iso).getTime();
}

function useNow(intervalMs = 1000): number {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
    return now;
}

function parseBeatmapId(input: string): number | null {
    const match = input.trim().match(/(\d+)[^\d]*$/);
    if (match === null) return null;
    const id = parseInt(match[1]);
    return Number.isFinite(id) && id > 0 ? id : null;
}

interface BattleRoyaleGameProps {
    minigame: Minigame;
    scoringScores: MinigameScore[];
}

const BattleRoyaleGame = (props: BattleRoyaleGameProps) => {
    const { minigame } = props;
    const config = minigame.config;
    const state = (minigame.state ?? {}) as Partial<BattleRoyaleState>;
    const rounds = state.rounds ?? [];
    const activeTeamIds = new Set(state.active_team_ids ?? []);
    const playStartWindow = (config.play_start_window as number) ?? 30;
    const intermission = (config.intermission as number) ?? 60;
    const now = useNow();

    const beatmapIds = useMemo(() => rounds.map((r) => r.beatmap_id), [rounds]);
    const beatmapQueries = useBeatmaps(beatmapIds);
    const beatmapById = useMemo(() => {
        const map = new Map<number, Beatmap>();
        beatmapQueries.forEach((query, i) => {
            if (query.data !== undefined) map.set(beatmapIds[i], query.data);
        });
        return map;
    }, [beatmapQueries, beatmapIds]);

    const liveRoundIndex = rounds.findIndex(
        (r) => now >= ts(r.round_start) && now < ts(r.cutoff_time),
    );
    const nextRoundIndex = rounds.findIndex((r) => now < ts(r.round_start));

    const currentRoundIndex = liveRoundIndex !== -1 ? liveRoundIndex : nextRoundIndex;
    const currentRoundLabel = liveRoundIndex !== -1 ? "live" : "current";

    const [selectedRoundIndex, setSelectedRoundIndex] = useState<number | null>(null);

    const defaultRoundIndex =
        liveRoundIndex !== -1
            ? liveRoundIndex
            : nextRoundIndex !== -1
              ? nextRoundIndex
              : rounds.length - 1;
    const viewIndex = selectedRoundIndex ?? defaultRoundIndex;
    const viewRound = viewIndex !== -1 ? rounds[viewIndex] : null;
    const viewBeatmap = viewRound !== null ? beatmapById.get(viewRound.beatmap_id) : undefined;

    const roundStatus = (index: number): "live" | "upcoming" | "complete" => {
        if (index === liveRoundIndex) return "live";
        if (now < ts(rounds[index].round_start)) return "upcoming";
        return "complete";
    };

    const outcomeText = (targetTeams: number, status: "live" | "upcoming" | "complete"): string =>
        targetTeams === 1
            ? status === "complete"
                ? "1 survived"
                : "1 will survive"
            : status === "complete"
              ? `${targetTeams} survived`
              : `${targetTeams} will survive`;

    const teamById = useMemo(() => {
        const map = new Map<number, MinigameTeam>();
        minigame.teams.forEach((team) => map.set(team.id, team));
        return map;
    }, [minigame.teams]);

    const eliminatedBeforeIndex = useMemo(() => {
        const sets: Set<number>[] = [];
        const acc = new Set<number>();
        for (const round of rounds) {
            sets.push(new Set(acc));
            round.eliminated_team_ids.forEach((teamId) => acc.add(teamId));
        }
        return sets;
    }, [rounds]);

    const standingsFor = (index: number) => {
        const round = rounds[index];
        const status = roundStatus(index);
        const eliminatedInRound = new Set(round.eliminated_team_ids);
        const activeAtStart = new Set(
            minigame.teams
                .map((team) => team.id)
                .filter((id) => !eliminatedBeforeIndex[index].has(id)),
        );

        const pool =
            status === "live"
                ? minigame.teams
                      .filter((team) => activeTeamIds.has(team.id))
                      .map((team) => ({ team, eliminated: false }))
                : minigame.teams
                      .filter((team) => activeAtStart.has(team.id))
                      .map((team) => ({
                          team,
                          eliminated: status === "complete" && eliminatedInRound.has(team.id),
                      }));

        return pool
            .map(({ team, eliminated }) => ({
                team,
                eliminated,
                score: round.team_scores[team.id] ?? 0,
                hasScore: round.team_scores[team.id] !== undefined,
            }))
            .sort((a, b) => {
                if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
                if (a.hasScore !== b.hasScore) return a.hasScore ? -1 : 1;
                return b.score - a.score;
            });
    };

    const winnerTeam =
        minigame.winningTeamId !== null
            ? (minigame.teams.find((t) => t.id === minigame.winningTeamId) ?? null)
            : null;

    const gameEnded = minigame.endTime !== null && now >= minigame.endTime.getTime();
    const showFinalising =
        minigame.status === MinigameStatus.Finalising ||
        (gameEnded && minigame.status !== MinigameStatus.Finished);

    const getPhaseTimer = () => {
        if (viewRound === null || viewIndex === -1) return null;
        const roundStart = ts(viewRound.round_start);
        const cutoff = ts(viewRound.cutoff_time);

        if (viewIndex === liveRoundIndex) {
            const playDeadline = roundStart + playStartWindow * 1000;
            if (now < playDeadline) {
                return <CountdownTimer target={new Date(playDeadline)} label="Start playing now" />;
            }
            return <CountdownTimer target={new Date(cutoff)} label="Submissions close in" />;
        }
        if (now < roundStart) {
            return (
                <CountdownTimer
                    target={new Date(roundStart)}
                    label={`Round ${viewIndex + 1} starts in`}
                />
            );
        }
        return null;
    };

    const phaseTimer = getPhaseTimer();

    const getPhaseProgress = (): number | null => {
        if (viewRound === null || viewIndex === -1) return null;
        const roundStart = ts(viewRound.round_start);
        const cutoff = ts(viewRound.cutoff_time);

        if (viewIndex === liveRoundIndex) {
            const playDeadline = roundStart + playStartWindow * 1000;
            const start = now < playDeadline ? roundStart : playDeadline;
            const end = now < playDeadline ? playDeadline : cutoff;
            return Math.min(1, Math.max(0, (now - start) / (end - start)));
        }
        if (now < roundStart) {
            const duration = intermission * 1000;
            return Math.min(1, Math.max(0, (now - (roundStart - duration)) / duration));
        }
        return null;
    };

    const phaseProgress = getPhaseProgress();

    return (
        <GameBoard>
            {winnerTeam !== null && <WinnerBanner>{winnerTeam.name} wins!</WinnerBanner>}
            {showFinalising && <FinalisingBanner>Finalising scores...</FinalisingBanner>}

            {viewRound !== null && (
                <RoundCard>
                    <RoundStatusBadge $status={roundStatus(viewIndex)}>
                        {roundStatus(viewIndex)}
                    </RoundStatusBadge>
                    <RoundCardBanner
                        $bleed={phaseTimer === null}
                        style={
                            viewBeatmap !== undefined
                                ? {
                                      backgroundImage: `url(https://assets.ppy.sh/beatmaps/${viewBeatmap.setId}/covers/cover.jpg)`,
                                  }
                                : undefined
                        }
                    >
                        <RoundCardBannerContent>
                            <RoundTitle>Round {viewIndex + 1}</RoundTitle>
                            <BeatmapLine>
                                {viewBeatmap !== undefined ? (
                                    <>
                                        <a
                                            href={`https://osu.ppy.sh/beatmapsets/${viewBeatmap.setId}#osu/${viewBeatmap.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {viewBeatmap.artist} - {viewBeatmap.title} [
                                            {viewBeatmap.difficultyName}]
                                        </a>
                                        {viewRound.allowed_mods.length > 0 && (
                                            <BeatmapMods>
                                                <FreeModLabel>FreeMods</FreeModLabel>
                                                <BeatmapModsInner>
                                                    <ModIcons
                                                        small
                                                        mods={modsJsonFromModAcronyms(
                                                            viewRound.allowed_mods,
                                                        )}
                                                    />
                                                </BeatmapModsInner>
                                            </BeatmapMods>
                                        )}
                                    </>
                                ) : (
                                    <span>Beatmap {viewRound.beatmap_id}</span>
                                )}
                            </BeatmapLine>
                            <BannerMetaRow>
                                <TimelineMeta>
                                    {outcomeText(viewRound.target_teams, roundStatus(viewIndex))}
                                </TimelineMeta>
                            </BannerMetaRow>
                            {viewBeatmap !== undefined && (
                                <BeatmapId>{viewRound.beatmap_id}</BeatmapId>
                            )}
                        </RoundCardBannerContent>
                    </RoundCardBanner>
                    {phaseTimer !== null && (
                        <TimerSection>
                            {phaseProgress !== null && <TimerProgress $progress={phaseProgress} />}
                            <TimerContent>{phaseTimer}</TimerContent>
                        </TimerSection>
                    )}
                </RoundCard>
            )}

            {viewRound !== null && (
                <>
                    <SectionTitleRow>
                        <SectionTitle>Round {viewIndex + 1} standings</SectionTitle>
                        {currentRoundIndex !== -1 && viewIndex !== currentRoundIndex && (
                            <Button
                                type="button"
                                $minWidth={0}
                                $active
                                action={() =>
                                    setSelectedRoundIndex(
                                        liveRoundIndex !== -1 ? null : currentRoundIndex,
                                    )
                                }
                            >
                                Return to round {currentRoundIndex + 1} ({currentRoundLabel})
                            </Button>
                        )}
                    </SectionTitleRow>
                    {roundStatus(viewIndex) === "upcoming" ? (
                        <EmptyState>This round hasn't started yet.</EmptyState>
                    ) : (
                        <StandingsList>
                            {standingsFor(viewIndex).map(
                                ({ team, score, hasScore, eliminated }) => (
                                    <motion.div
                                        key={team.id}
                                        layout
                                        transition={{
                                            duration: 0.3,
                                            type: "tween",
                                            ease: "easeOut",
                                        }}
                                    >
                                        <StandingRow $eliminated={eliminated}>
                                            <span>
                                                {team.name}
                                                {eliminated && " (eliminated)"}
                                            </span>
                                            <StandingScore>
                                                {hasScore ? score.toLocaleString() : "—"}
                                            </StandingScore>
                                        </StandingRow>
                                    </motion.div>
                                ),
                            )}
                        </StandingsList>
                    )}
                    {roundStatus(viewIndex) === "complete" &&
                        viewRound.eliminated_team_ids.length > 0 && (
                            <EliminatedSummary>
                                {viewRound.eliminated_team_ids.length}{" "}
                                {minigame.isFreeForAll ? "player" : "team"}
                                {viewRound.eliminated_team_ids.length > 1 ? "s" : ""} eliminated:{" "}
                                {viewRound.eliminated_team_ids
                                    .map((teamId) => teamById.get(teamId)?.name ?? `Team ${teamId}`)
                                    .join(", ")}
                            </EliminatedSummary>
                        )}
                </>
            )}

            {rounds.length > 0 && (
                <>
                    <SectionTitle>Rounds</SectionTitle>
                    <TimelineList>
                        {rounds.map((round, i) => {
                            const beatmap = beatmapById.get(round.beatmap_id);
                            const status = roundStatus(i);
                            return (
                                <TimelineRow
                                    key={i}
                                    $live={status === "live"}
                                    $complete={status === "complete"}
                                    $selected={i === viewIndex}
                                    onClick={() =>
                                        setSelectedRoundIndex(i === liveRoundIndex ? null : i)
                                    }
                                >
                                    <TimelineBeatmap>
                                        Round {i + 1}:{" "}
                                        {beatmap !== undefined
                                            ? `${beatmap.artist} - ${beatmap.title} [${beatmap.difficultyName}]`
                                            : `Beatmap ${round.beatmap_id}`}
                                    </TimelineBeatmap>
                                    <TimelineMeta>
                                        {status === "live" && (
                                            <span>
                                                <Tooltip content="All teams that survive this round score 1 point">
                                                    <span>
                                                        {outcomeText(round.target_teams, "live")}
                                                    </span>
                                                </Tooltip>
                                            </span>
                                        )}
                                        {status === "upcoming" &&
                                            outcomeText(round.target_teams, "upcoming")}
                                        {status === "complete" &&
                                            `${outcomeText(round.target_teams, "complete")} · ${round.eliminated_team_ids.length} eliminated`}
                                    </TimelineMeta>
                                </TimelineRow>
                            );
                        })}
                    </TimelineList>
                </>
            )}
        </GameBoard>
    );
};

interface BeatmapRow {
    id: string;
    mods: ModsJson;
}

interface BattleRoyaleSettingsProps {
    open: boolean;
    onClose: () => void;
    minigame: Minigame;
}

function rowsFromConfig(config: Record<string, unknown>): BeatmapRow[] {
    const beatmaps =
        (config.beatmaps as { beatmap_id: number; allowed_mods: string[] }[] | undefined) ?? [];
    return beatmaps.map((beatmap) => ({
        id: String(beatmap.beatmap_id),
        mods: modsJsonFromModAcronyms(beatmap.allowed_mods ?? []),
    }));
}

const SettingsRow = styled.div`
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: ${(props) => props.theme.colours.foreground};
`;

const SettingsRowHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
`;

const SettingsRowPreview = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85em;
    margin-top: 8px;
    min-height: 24px;
`;

const PreviewCover = styled.img`
    width: 40px;
    height: 24px;
    object-fit: cover;
    border-radius: 3px;
    flex-shrink: 0;
`;

const AddButton = styled(Button)`
    margin-top: 4px;
`;

const SettingsValidation = styled.p`
    color: ${(props) => props.theme.colours.negative};
    font-size: 0.85em;
    margin: 8px 0 0;
`;

const SettingsHint = styled.p`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.timber};
    opacity: 0.7;
    margin: 6px 0 0;
`;

const BeatmapsLabel = styled(FormLabel)`
    margin-bottom: 10px;
`;

const BattleRoyaleSubmit = styled(SettingsSubmit)`
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const BattleRoyaleSettings = (props: BattleRoyaleSettingsProps) => {
    const { open, onClose, minigame } = props;
    const updateMutation = useUpdateSettings();

    const [rows, setRows] = useState<BeatmapRow[]>(() => rowsFromConfig(minigame.config));
    const [playStartWindow, setPlayStartWindow] = useState(
        (minigame.config.play_start_window as number) ?? 30,
    );
    const [submissionBuffer, setSubmissionBuffer] = useState(
        (minigame.config.submission_buffer as number) ?? 30,
    );
    const [intermission, setIntermission] = useState(
        (minigame.config.intermission as number) ?? 60,
    );

    useEffect(() => {
        setRows(rowsFromConfig(minigame.config));
        setPlayStartWindow((minigame.config.play_start_window as number) ?? 30);
        setSubmissionBuffer((minigame.config.submission_buffer as number) ?? 30);
        setIntermission((minigame.config.intermission as number) ?? 60);
    }, [minigame.config]);

    const parsedIds = rows.map((row) => parseBeatmapId(row.id));
    const validIds = useMemo(
        () => parsedIds.filter((id): id is number => id !== null),
        [parsedIds],
    );
    const previewQueries = useBeatmaps(validIds);
    const previewById = useMemo(() => {
        const map = new Map<number, Beatmap>();
        previewQueries.forEach((query, i) => {
            if (query.data !== undefined) map.set(validIds[i], query.data);
        });
        return map;
    }, [previewQueries, validIds]);

    const updateRowId = (index: number, id: string) => {
        setRows((prev) => prev.map((row, i) => (i === index ? { ...row, id } : row)));
    };

    const updateRowMods = (index: number, mods: ModsJson) => {
        setRows((prev) => prev.map((row, i) => (i === index ? { ...row, mods } : row)));
    };

    const removeRow = (index: number) => {
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    const addRow = () => {
        setRows((prev) => [...prev, { id: "", mods: {} }]);
    };

    const beatmaps = useMemo(
        () =>
            rows
                .map((row) => ({
                    beatmap_id: parseBeatmapId(row.id),
                    allowed_mods: modAcronymsFromJsonMods(row.mods),
                }))
                .filter(
                    (beatmap): beatmap is { beatmap_id: number; allowed_mods: string[] } =>
                        beatmap.beatmap_id !== null,
                ),
        [rows],
    );
    const hasValidBeatmaps = beatmaps.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasValidBeatmaps) return;
        await updateMutation.mutateAsync({
            id: minigame.id,
            settings: {
                beatmaps,
                play_start_window: playStartWindow,
                submission_buffer: submissionBuffer,
                intermission,
            },
        });
        onClose();
    };

    return (
        <SimpleModal open={open} onClose={onClose}>
            <SimpleModalTitle>Settings</SimpleModalTitle>
            <SettingsDescription>Minigame: {formatGameType(minigame.gameType)}</SettingsDescription>
            <form onSubmit={handleSubmit}>
                <BeatmapsLabel>Beatmaps (ID or osu.ppy.sh beatmap URL)</BeatmapsLabel>
                {rows.map((row, index) => {
                    const beatmapId = parsedIds[index];
                    const preview = beatmapId !== null ? previewById.get(beatmapId) : undefined;
                    return (
                        <SettingsRow key={index}>
                            <SettingsRowHeader>
                                <TextInput
                                    $fullWidth
                                    required
                                    placeholder="e.g. 5211120 or https://osu.ppy.sh/beatmapsets/2191876#osu/5211120"
                                    value={row.id}
                                    onChange={(e) => updateRowId(index, e.currentTarget.value)}
                                />
                                <Button $negative type="button" action={() => removeRow(index)}>
                                    <IconLeft icon={faTrashCan} fixedWidth />
                                </Button>
                            </SettingsRowHeader>
                            <ModsSelect
                                gamemode={minigame.gamemode}
                                value={row.mods}
                                onChange={(mods) => updateRowMods(index, mods)}
                            />
                            <SettingsHint>
                                Freemod — these mods are optional, players may use any or none.
                            </SettingsHint>
                            <SettingsRowPreview>
                                {preview !== undefined && (
                                    <>
                                        <PreviewCover
                                            src={`https://assets.ppy.sh/beatmaps/${preview.setId}/covers/list.jpg`}
                                            alt=""
                                        />
                                        <span>
                                            {preview.artist} - {preview.title} [
                                            {preview.difficultyName}]
                                        </span>
                                    </>
                                )}
                            </SettingsRowPreview>
                        </SettingsRow>
                    );
                })}
                <AddButton type="button" action={addRow}>
                    <IconLeft icon={faPlus} fixedWidth /> Add Beatmap
                </AddButton>
                {!hasValidBeatmaps && (
                    <SettingsValidation>
                        Add at least one beatmap to save settings.
                    </SettingsValidation>
                )}

                <FormLabel>Time to start play (seconds)</FormLabel>
                <TextInput
                    $fullWidth
                    type="number"
                    min={10}
                    max={120}
                    required
                    value={playStartWindow}
                    onChange={(e) => setPlayStartWindow(Number(e.currentTarget.value))}
                />

                <FormLabel>Submission buffer (seconds)</FormLabel>
                <TextInput
                    $fullWidth
                    type="number"
                    min={10}
                    max={120}
                    required
                    value={submissionBuffer}
                    onChange={(e) => setSubmissionBuffer(Number(e.currentTarget.value))}
                />

                <FormLabel>Intermission (seconds)</FormLabel>
                <TextInput
                    $fullWidth
                    type="number"
                    min={10}
                    max={300}
                    required
                    value={intermission}
                    onChange={(e) => setIntermission(Number(e.currentTarget.value))}
                />

                <BattleRoyaleSubmit
                    $positive
                    type="submit"
                    isLoading={updateMutation.isPending}
                    disabled={!hasValidBeatmaps}
                >
                    <IconLeft icon={faCheck} fixedWidth /> Save
                </BattleRoyaleSubmit>
            </form>
        </SimpleModal>
    );
};

const battleRoyale: MinigameImplementation = {
    gameType: "battle_royale",
    label: "Battle Royale",
    GameComponent: BattleRoyaleGame,
    SettingsComponent: BattleRoyaleSettings,
    defaultSettings: {
        beatmaps: [],
        play_start_window: 30,
        submission_buffer: 30,
        intermission: 60,
        elimination_mode: "auto",
    },
};

export default battleRoyale;
