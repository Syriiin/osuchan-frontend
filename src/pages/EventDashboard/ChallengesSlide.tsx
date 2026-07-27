import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { ShortTimeAgo, Flag } from "../../components";
import { formatGamemodeName, gamemodeIcon } from "../../utils/formatting";
import type { BeatmapChallenge } from "../../store/models/events/types";
import type { Score } from "../../store/models/profiles/types";
import type { ChallengeScores } from "../../store/events/api";

const Slide = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0.3em 2em 0.5em;
`;

const CardGrid = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 0.6em;
    overflow: hidden;
    align-items: start;
    align-content: start;
`;

const ChallengeCard = styled.div`
    background-color: ${(props) => props.theme.colours.foreground};
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const CardBanner = styled.div<{ $setId: number }>`
    padding: 0.5em 0.8em;
    background:
        linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
        url("https://assets.ppy.sh/beatmaps/${(props) => props.$setId}/covers/cover.jpg");
    background-size: cover;
    background-position: center;
`;

const BeatmapInfo = styled.div`
    font-size: 0.9em;
    font-weight: 600;
    line-height: 1.3;
`;

const BeatmapTitle = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const BeatmapCreator = styled.div`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.7em;
`;

const ChallengeDescription = styled.div`
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.7em;
    margin-top: 2px;
`;

const MetaRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
`;

const ModeGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const ModeIcon = styled.img`
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
`;

const ModeName = styled.span`
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.7em;
`;

const ChallengeTypeBadge = styled.span`
    padding: 1px 6px;
    font-size: 0.65em;
    border-radius: 3px;
    background-color: ${(props) => props.theme.colours.mango};
    color: #fff;
    white-space: nowrap;
`;

const CardBody = styled.div`
    padding: 4px 8px 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const ScoreMiniRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    border-radius: 3px;
    height: 36px;
`;

const ScorePlayer = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    flex: 1;
`;

const ScoreAvatar = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 3px;
    flex-shrink: 0;
`;

const ScoreFlag = styled.span`
    flex-shrink: 0;
    font-size: 0.75em;
    line-height: 0;
`;

const ScoreName = styled.span`
    font-size: 0.85em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ScoreValue = styled.span`
    font-size: 0.85em;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
`;

const ScoreTime = styled.span`
    font-size: 0.7em;
    color: ${(props) => props.theme.colours.timber};
    white-space: nowrap;
    flex-shrink: 0;
    margin: 0 6px;
`;

const EmptyText = styled.p`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.8em;
    text-align: center;
    margin: auto;
`;

const NoScores = styled.p`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.65em;
    text-align: center;
    margin: 4px 0;
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

function formatMetric(score: Score, challengeType: string): string {
    switch (challengeType) {
        case "best_combo": {
            const maxCombo = score.beatmap?.maxCombo ?? 0;
            if (score.bestCombo >= maxCombo) return "FC";
            return `${score.bestCombo}/${maxCombo}`;
        }
        case "lowest_miss_count": {
            const misses = score.statistics?.["miss"] ?? 0;
            return `${misses} ${misses === 1 ? "miss" : "misses"}`;
        }
        default:
            return "";
    }
}

interface ChallengesSlideProps {
    challenges: BeatmapChallenge[];
    challengeScores: ChallengeScores;
}

const ChallengesSlide = observer(({ challenges, challengeScores }: ChallengesSlideProps) => (
    <Slide>
        {challenges.length === 0 ? (
            <EmptyText>No challenges yet.</EmptyText>
        ) : (
            <CardGrid>
                {challenges.map((challenge) => {
                    const scores = (challengeScores[challenge.id] ?? []).slice(0, 5);
                    return (
                        <ChallengeCard key={challenge.id}>
                            <CardBanner $setId={challenge.beatmap.setId}>
                                <BeatmapInfo>
                                    <BeatmapTitle>
                                        {challenge.beatmap.artist} - {challenge.beatmap.title}
                                    </BeatmapTitle>
                                    <BeatmapTitle>
                                        [{challenge.beatmap.difficultyName}]
                                    </BeatmapTitle>
                                    <BeatmapCreator>
                                        by {challenge.beatmap.creatorName}
                                    </BeatmapCreator>
                                    {challenge.description && (
                                        <ChallengeDescription>
                                            {challenge.description}
                                        </ChallengeDescription>
                                    )}
                                </BeatmapInfo>
                                <MetaRow>
                                    <ModeGroup>
                                        <ModeIcon src={gamemodeIcon(challenge.gamemode)} />
                                        <ModeName>
                                            {formatGamemodeName(challenge.gamemode)}
                                        </ModeName>
                                    </ModeGroup>
                                    <ChallengeTypeBadge>
                                        {formatChallengeType(challenge.challengeType)}
                                    </ChallengeTypeBadge>
                                </MetaRow>
                            </CardBanner>
                            <CardBody>
                                {scores.map((score) => {
                                    const userStats = score.userStats!;
                                    const osuUser = userStats.osuUser!;
                                    return (
                                        <ScoreMiniRow key={score.id}>
                                            <ScorePlayer>
                                                <ScoreAvatar
                                                    src={`https://a.ppy.sh/${userStats.osuUserId}`}
                                                />
                                                <ScoreFlag>
                                                    <Flag countryCode={osuUser.country} />
                                                </ScoreFlag>
                                                <ScoreName>{osuUser.username}</ScoreName>
                                            </ScorePlayer>
                                            <ScoreTime>
                                                <ShortTimeAgo date={score.date} />
                                            </ScoreTime>
                                            <ScoreValue>
                                                {formatMetric(score, challenge.challengeType)}
                                            </ScoreValue>
                                        </ScoreMiniRow>
                                    );
                                })}
                                {scores.length === 0 && <NoScores>No scores yet</NoScores>}
                            </CardBody>
                        </ChallengeCard>
                    );
                })}
            </CardGrid>
        )}
    </Slide>
));

export default ChallengesSlide;
