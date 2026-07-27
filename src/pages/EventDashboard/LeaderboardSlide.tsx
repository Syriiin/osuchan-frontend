import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Flag, ModIcons, NumberFormat, TimeAgo } from "../../components";
import type { Membership } from "../../store/models/leaderboards/types";
import type { Score } from "../../store/models/profiles/types";
import { formatScoreResult } from "../../utils/formatting";
import type { LeaderboardDetailData } from "../../store/events/api";

const Slide = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 2em 1em;
`;

const Panels = styled.div`
    flex: 1;
    display: flex;
    gap: 1.5em;
    min-height: 0;
`;

const Panel = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
`;

const PanelTitle = styled.h3`
    font-size: 1.1em;
    font-weight: 600;
    margin: 0 0 0.4em;
    text-align: center;
    color: ${(props) => props.theme.colours.timber};
`;

const ScrollList = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
`;

const MemberRow = styled.div`
    display: flex;
    align-items: center;
    background-color: ${(props) => props.theme.colours.foreground};
    border-radius: 6px;
    padding: 0.55em 0.5em;
    flex-shrink: 0;
`;

const MemberRank = styled.span`
    width: 2.2em;
    text-align: center;
    font-size: 1.2em;
    font-weight: 700;
    flex-shrink: 0;
`;

const MemberAvatar = styled.img`
    width: 2em;
    height: 2em;
    border-radius: 4px;
    margin: 0 0.5em;
    flex-shrink: 0;
`;

const MemberFlag = styled.span`
    margin-right: 0.4em;
    flex-shrink: 0;
`;

const MemberName = styled.span`
    font-size: 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
`;

const MemberScoreCount = styled.span`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.timber};
    margin-right: 0.5em;
    flex-shrink: 0;
`;

const MemberPP = styled.span`
    font-size: 1.1em;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
`;

const RowDivider = styled.div`
    border-top: 1px solid ${(props) => props.theme.colours.midground};
    margin: 4px 0;
`;

const ScoreRowWrapper = styled.div<{ $beatmapSetId: number }>`
    display: flex;
    padding: 0;
    align-items: unset;
    background:
        linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        url("https://assets.ppy.sh/beatmaps/${(props) => props.$beatmapSetId}/covers/cover.jpg");
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    text-shadow: 0 0 0.5em black;
    flex-shrink: 0;
`;

const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
`;

const ScorePlayerInfo = styled.div`
    display: flex;
    align-items: center;
    margin: 0.15em 0.3em;
`;

const ScoreAvatar = styled.img`
    width: 1.6em;
    height: 1.6em;
    border-radius: 0.2em;
    margin-right: 0.4em;
`;

const ScoreFlag = styled.span`
    margin-right: 0.4em;
`;

const ScoreUsername = styled.span`
    font-size: 0.85em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ScoreBeatmapInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 0.3em;
`;

const ScoreTitle = styled.span`
    font-size: 0.7em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ScoreArtist = styled.span`
    font-size: 0.6em;
    color: ${(props) => props.theme.colours.timber};
`;

const ScoreDifficulty = styled.span`
    font-size: 0.6em;
    color: ${(props) => props.theme.colours.mango};
`;

const ScoreModsContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 0 0.2em;
`;

const ScoreInfo = styled.div`
    display: flex;
    margin: 0.15em 0.3em;
    font-size: 0.85em;
`;

const AccContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 0.4em;
    text-align: right;
    flex-grow: 1;
`;

const ScoreAcc = styled.span`
    font-size: 0.9em;
`;

const ScoreDate = styled.span`
    font-size: 0.65em;
    color: ${(props) => props.theme.colours.timber};
`;

const PerfContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 0.4em;
`;

const ScorePP = styled.span`
    font-size: 1em;
    font-weight: 700;
`;

const ScoreResult = styled.span`
    font-size: 0.7em;
`;

interface MemberRankingRowProps {
    membership: Membership;
    rank: number;
}

const MemberRankingRow = observer(({ membership, rank }: MemberRankingRowProps) => (
    <MemberRow>
        <MemberRank>#{rank}</MemberRank>
        <MemberAvatar src={`https://a.ppy.sh/${membership.osuUserId}`} />
        <MemberFlag>
            <Flag countryCode={membership.osuUser!.country} />
        </MemberFlag>
        <MemberName>{membership.osuUser!.username}</MemberName>
        <MemberScoreCount>
            {membership.scoreCount} score{membership.scoreCount !== 1 ? "s" : ""}
        </MemberScoreCount>
        <MemberPP>
            <NumberFormat value={membership.pp} decimalPlaces={0} />
            pp
        </MemberPP>
    </MemberRow>
));

interface ScoreRowDisplayProps {
    score: Score;
}

const ScoreRowDisplay = observer(({ score }: ScoreRowDisplayProps) => {
    const userStats = score.userStats!;
    const beatmap = score.beatmap!;

    return (
        <ScoreRowWrapper $beatmapSetId={beatmap.setId}>
            <LeftContainer>
                <ScorePlayerInfo>
                    <ScoreAvatar src={`https://a.ppy.sh/${userStats.osuUserId}`} />
                    <ScoreFlag>
                        <Flag countryCode={userStats.osuUser!.country} />
                    </ScoreFlag>
                    <ScoreUsername>{userStats.osuUser!.username}</ScoreUsername>
                </ScorePlayerInfo>
                <ScoreBeatmapInfo>
                    <ScoreTitle>{beatmap.title}</ScoreTitle>
                    <ScoreArtist>
                        <small>by</small> {beatmap.artist}
                    </ScoreArtist>
                    <ScoreDifficulty>{beatmap.difficultyName}</ScoreDifficulty>
                </ScoreBeatmapInfo>
            </LeftContainer>
            <ScoreModsContainer>
                <ModIcons small mods={score.modsJson} />
            </ScoreModsContainer>
            <ScoreInfo>
                <AccContainer>
                    <ScoreAcc>
                        <NumberFormat value={score.accuracy} decimalPlaces={2} />%
                    </ScoreAcc>
                    <ScoreDate>
                        <TimeAgo datetime={score.date} />
                    </ScoreDate>
                </AccContainer>
                <PerfContainer>
                    <ScorePP>
                        <NumberFormat value={score.performanceTotal} decimalPlaces={0} />
                        pp
                    </ScorePP>
                    <ScoreResult>{formatScoreResult(score.result)}</ScoreResult>
                </PerfContainer>
            </ScoreInfo>
        </ScoreRowWrapper>
    );
});

interface LeaderboardSlideProps {
    data: LeaderboardDetailData;
}

const LeaderboardSlide = observer(({ data }: LeaderboardSlideProps) => {
    const displayedRankings = data.rankings.slice(0, 15);
    const displayedScores = data.scores.slice(0, 15);

    return (
        <Slide>
            <Panels>
                <Panel>
                    <PanelTitle>Player Rankings</PanelTitle>
                    <ScrollList>
                        {displayedRankings.map((membership, i) => (
                            <MemberRankingRow
                                key={membership.id}
                                membership={membership}
                                rank={i + 1}
                            />
                        ))}
                        {displayedRankings.length === 0 && <MemberRow>No members yet.</MemberRow>}
                    </ScrollList>
                </Panel>
                <RowDivider />
                <Panel>
                    <PanelTitle>Top Scores</PanelTitle>
                    <ScrollList>
                        {displayedScores.map((score, i) => (
                            <ScoreRowDisplay key={score.id ?? i} score={score} />
                        ))}
                        {displayedScores.length === 0 && <MemberRow>No scores yet.</MemberRow>}
                    </ScrollList>
                </Panel>
            </Panels>
        </Slide>
    );
});

export default LeaderboardSlide;
