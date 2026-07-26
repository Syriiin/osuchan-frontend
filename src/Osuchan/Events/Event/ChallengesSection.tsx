import { observer } from "mobx-react-lite";
import { useState } from "react";
import styled from "styled-components";

import {
    Button,
    LoadingPage,
    NumberFormat,
    ScoreModal,
    ShortTimeAgo,
    Surface,
} from "../../../components";
import type { BeatmapChallenge } from "../../../store/models/events/types";
import type { Score } from "../../../store/models/profiles/types";
import { ResourceStatus } from "../../../store/status";
import {
    formatGamemodeName,
    formatGamemodeNameShort,
    gamemodeIcon,
} from "../../../utils/formatting";
import CreateChallengeModal from "./CreateChallengeModal";

const EventSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
`;

const SectionTitle = styled.h3`
    margin: 0;
    font-size: 1.5em;
    font-weight: 700;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
`;

const ChallengeCard = styled.div`
    background-color: ${(props) => props.theme.colours.foreground};
    border-radius: 8px;
    overflow: hidden;
`;

const CardBanner = styled.div<{ $setId: number }>`
    padding: 14px;
    background:
        linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
        url("https://assets.ppy.sh/beatmaps/${(props) => props.$setId}/covers/cover.jpg");
    background-size: cover;
    background-position: center;
`;

const CardBody = styled.div`
    padding: 10px 14px 14px;
`;

const BeatmapInfo = styled.a`
    display: block;
    font-size: 0.95em;
    font-weight: 600;
    line-height: 1.3;
    color: #fff;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const BeatmapCreator = styled.div`
    color: ${(props) => props.theme.colours.timber};
`;

const ChallengeMetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
`;

const GamemodeIcon = styled.img`
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
    vertical-align: middle;
`;

const GamemodeName = styled.span`
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.8em;
    line-height: 1;
`;

const ChallengeTypeBadge = styled.span`
    padding: 2px 8px;
    font-size: 0.75em;
    border-radius: 3px;
    background-color: ${(props) => props.theme.colours.mango};
    color: #fff;
    white-space: nowrap;
`;

const ChallengeDescription_ = styled.span`
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.85em;
`;

const MiniRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 80px 70px;
    gap: 8px;
    align-items: center;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
        background-color: ${(props) => props.theme.colours.midground};
    }

    & + & {
        margin-top: 2px;
    }
`;

const PlayerInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
`;

const Avatar = styled.img`
    width: 28px;
    height: 28px;
    border-radius: 4px;
    flex-shrink: 0;
`;

const Username = styled.span`
    font-size: 0.9em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const MetricValue = styled.span`
    font-size: 0.9em;
    font-weight: 600;
    text-align: right;
`;

const TimeCell = styled.div`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.timber};
    text-align: right;
`;

const NoScores = styled.p`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.85em;
    margin: 8px 0 0 0;
`;

function formatChallengeType(challengeType: string): string {
    switch (challengeType) {
        case "best_combo":
            return "Best Combo";
        case "lowest_miss_count":
            return "Lowest Miss Count";
        default:
            return challengeType;
    }
}

function metricValue(score: Score, challengeType: string): number {
    switch (challengeType) {
        case "best_combo":
            return score.bestCombo;
        case "lowest_miss_count":
            return score.statistics?.["miss"] ?? 0;
        default:
            return 0;
    }
}

const MiniScoreRow = observer(
    ({ score, challengeType }: { score: Score; challengeType: string }) => {
        const [modalOpen, setModalOpen] = useState(false);
        const userStats = score.userStats!;
        const osuUser = userStats.osuUser!;

        return (
            <>
                <MiniRow onClick={() => setModalOpen(true)}>
                    <PlayerInfo>
                        <Avatar src={`https://a.ppy.sh/${userStats.osuUserId}`} />
                        <Username>{osuUser.username}</Username>
                    </PlayerInfo>
                    <MetricValue>
                        {challengeType === "best_combo" ? (
                            score.bestCombo >= (score.beatmap?.maxCombo ?? 0) ? (
                                "FC"
                            ) : (
                                <>
                                    <NumberFormat value={score.bestCombo} decimalPlaces={0} />
                                    /
                                    <NumberFormat
                                        value={score.beatmap?.maxCombo ?? 0}
                                        decimalPlaces={0}
                                    />
                                </>
                            )
                        ) : (
                            <NumberFormat
                                value={metricValue(score, challengeType)}
                                decimalPlaces={0}
                            />
                        )}
                    </MetricValue>
                    <TimeCell>
                        <ShortTimeAgo date={score.date} />
                    </TimeCell>
                </MiniRow>
                <ScoreModal score={score} open={modalOpen} onClose={() => setModalOpen(false)} />
            </>
        );
    },
);

const ChallengesSection = observer((props: ChallengesSectionProps) => {
    const { challenges, challengeScores, loadingStatus, isOrganiser } = props;
    const [createModalOpen, setCreateModalOpen] = useState(false);

    return (
        <EventSurface>
            <SectionHeader>
                <SectionTitle>Challenges</SectionTitle>
                {isOrganiser && (
                    <Button type="button" action={() => setCreateModalOpen(true)}>
                        Create Challenge
                    </Button>
                )}
            </SectionHeader>
            {loadingStatus === ResourceStatus.Loading && <LoadingPage />}
            {loadingStatus === ResourceStatus.Loaded && challenges.length === 0 && (
                <NoScores>No challenges yet.</NoScores>
            )}
            {loadingStatus === ResourceStatus.Loaded && (
                <CardGrid>
                    {challenges.map((challenge) => {
                        const scores = challengeScores.get(challenge.id) ?? [];
                        return (
                            <ChallengeCard key={challenge.id}>
                                <CardBanner $setId={challenge.beatmap.setId}>
                                    <BeatmapInfo
                                        href={`https://osu.ppy.sh/beatmapsets/${challenge.beatmap.setId}#${formatGamemodeNameShort(challenge.gamemode)}/${challenge.beatmap.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {challenge.beatmap.artist} - {challenge.beatmap.title} [
                                        {challenge.beatmap.difficultyName}]
                                    </BeatmapInfo>
                                    <BeatmapCreator>
                                        by {challenge.beatmap.creatorName}
                                    </BeatmapCreator>
                                    <ChallengeMetaRow>
                                        {challenge.description && (
                                            <ChallengeDescription_>
                                                {challenge.description}
                                            </ChallengeDescription_>
                                        )}
                                        <GamemodeIcon
                                            src={gamemodeIcon(challenge.gamemode)}
                                            alt=""
                                        />
                                        <GamemodeName>
                                            {formatGamemodeName(challenge.gamemode)}
                                        </GamemodeName>
                                        <ChallengeTypeBadge>
                                            {formatChallengeType(challenge.challengeType)}
                                        </ChallengeTypeBadge>
                                    </ChallengeMetaRow>
                                </CardBanner>
                                <CardBody>
                                    {scores.slice(0, 5).map((score) => (
                                        <MiniScoreRow
                                            key={score.id}
                                            score={score}
                                            challengeType={challenge.challengeType}
                                        />
                                    ))}
                                    {scores.length === 0 && <NoScores>No scores yet.</NoScores>}
                                </CardBody>
                            </ChallengeCard>
                        );
                    })}
                </CardGrid>
            )}

            <CreateChallengeModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                slug={props.slug}
            />
        </EventSurface>
    );
});

interface ChallengesSectionProps {
    challenges: BeatmapChallenge[];
    challengeScores: Map<number, Score[]>;
    loadingStatus: ResourceStatus;
    isOrganiser?: boolean | null;
    slug: string;
}

export default ChallengesSection;
