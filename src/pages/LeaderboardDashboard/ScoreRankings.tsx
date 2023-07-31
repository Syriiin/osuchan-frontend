import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Flag, ModIcons, NumberFormat, Row, TimeAgo } from "../../components";
import { Score } from "../../store/models/profiles/types";
import { formatScoreResult } from "../../utils/formatting";

const ScoreRowWrapper = styled(Row)<ScoreRowWrapperProps>`
    padding: 0;
    align-items: unset;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), ${props => `url("https://assets.ppy.sh/beatmaps/${props.beatmapSetId}/covers/cover.jpg")`};
    background-size: cover;
    text-shadow: 0 0 0.5em black;
    font-size: 0.3em;
`;

interface ScoreRowWrapperProps {
    beatmapSetId: number;
}

const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const PlayerInfo = styled.div`
    display: flex;
    align-items: center;
    margin: 0.3em;
`;

const Avatar = styled.img`
    width: 3em;
    border-radius: 0.3em;
    margin-right: 0.6em;
`;

const FlagContainer = styled.div`
    margin-right: 0.6em;
`;

const Username = styled.span`
    font-size: 1.5em;
`;

const BeatmapInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0.3em;
`;

const Title = styled.span``;

const Artist = styled.span`
    font-size: 0.8em;
`;

const DifficultyName = styled.span`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.mango};
`;

const ModsContainer = styled.div`
    display: flex;
    align-items: center;
`;

const ScoreInfo = styled.div`
    display: flex;
    margin: 0.3em;
    font-size: 1.5em;
`;

const AccuracyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 0.6em;
    text-align: right;
    flex-grow: 1;
`;

const Accuracy = styled.span``;

const ScoreDate = styled.span`
    font-size: 0.8em;
`;

const PerformanceContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 0.6em;
`;

const Performance = styled.span`
    font-size: 1.5em;
`;

const Result = styled.span`
    font-size: 0.8em;
`;

export const ScoreRow = observer((props: ScoreRowProps) => {
    const score = props.score;
    const userStats = score.userStats!;
    const beatmap = score.beatmap!;

    return (
        <ScoreRowWrapper beatmapSetId={beatmap.setId}>
            <LeftContainer>
                <PlayerInfo>
                    <Avatar
                        src={`https://a.ppy.sh/${userStats.osuUserId}`}
                    />
                    <FlagContainer>
                        <Flag countryCode={userStats.osuUser!.country} />
                    </FlagContainer>
                    <Username>{userStats.osuUser!.username}</Username>
                </PlayerInfo>
                <BeatmapInfo>
                    <Title>{beatmap.title}</Title>
                    <Artist>
                        <small>by</small> {beatmap.artist}
                    </Artist>
                    <DifficultyName>
                        {beatmap.difficultyName}
                    </DifficultyName>
                </BeatmapInfo>
            </LeftContainer>
            <ModsContainer>
                <ModIcons small bitwiseMods={score.mods} />
            </ModsContainer>
            <ScoreInfo>
                <AccuracyContainer>
                    <Accuracy>
                        <NumberFormat
                            value={score.accuracy}
                            decimalPlaces={2}
                        />
                        %
                    </Accuracy>
                    <ScoreDate>
                        <TimeAgo datetime={score.date} />
                    </ScoreDate>
                </AccuracyContainer>
                <PerformanceContainer>
                    <Performance>
                        <NumberFormat
                            value={score.performanceTotal}
                            decimalPlaces={0}
                        />
                        pp
                    </Performance>
                    <Result>{formatScoreResult(score.result)}</Result>
                </PerformanceContainer>
            </ScoreInfo>
        </ScoreRowWrapper>
    );
});

interface ScoreRowProps {
    score: Score;
}

const ScoreRankings = observer((props: ScoreRankingProps) => (
    <>
        {props.scores.map((score, i) => (
            <ScoreRow key={i} score={score}  />
        ))}
    </>
));

interface ScoreRankingProps {
    scores: Score[];
}

export default ScoreRankings;
