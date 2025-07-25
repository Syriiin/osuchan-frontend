import { useState } from "react";
import styled from "styled-components";
import { Score } from "../../store/models/profiles/types";

import { observer } from "mobx-react-lite";
import {
    Row,
    NumberFormat,
    ScoreModal,
    ShortTimeAgo,
    Surface,
} from "../../components";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { TeamColours } from ".";
import { PPRaceTeam } from "../../store/models/ppraces/types";

const ScoreRowWrapper = styled(Row)<{ teamColour: string }>`
    background-color: ${(props) => props.teamColour};

    &.slide-enter {
        opacity: 0;
        transform: translateX(100%);
    }
    &.slide-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: opacity 300ms, transform 300ms;
    }
    &.slide-enter-done {
        opacity: 1;
        transform: translateX(0);
    }
`;

const Player = styled.div`
    flex: 1;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Performance = styled.div`
    flex: 1;
    text-align: right;
`;

const ScoreTimeAgo = styled.div`
    min-width: 3em;
    text-align: right;
    font-size: 0.8em;
`;

const RecentScoreRow = observer((props: RecentScoreRowProps) => {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    const score = props.score;

    return (
        <>
            <ScoreRowWrapper
                hoverable
                onClick={
                    props.onClickOverride || (() => setDetailsModalOpen(true))
                }
                teamColour={props.teamColour}
            >
                <Player>{props.score.userStats!.osuUser!.username}</Player>
                <Performance>
                    <NumberFormat
                        value={score.performanceTotal}
                        decimalPlaces={0}
                    />
                    pp
                </Performance>
                <ScoreTimeAgo>
                    <ShortTimeAgo date={score.date} />
                </ScoreTimeAgo>
            </ScoreRowWrapper>
            <ScoreModal
                score={score}
                open={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
            />
        </>
    );
});

interface RecentScoreRowProps {
    teamColour: string;
    score: Score;
    onClickOverride?: () => void;
}

const RecentScoresSurface = styled(Surface)`
    padding: 10px;
    flex: 1;
`;

const RecentScores = observer((props: RecentScoresProps) => {
    return (
        <RecentScoresSurface>
            <TransitionGroup>
                {props.recentScores.slice(0, 20).map((score) => {
                    const team = props.teams.find((t) =>
                        t.players.some(
                            (p) => p.user.id === score.userStats!.osuUserId
                        )
                    );
                    return (
                        <CSSTransition
                            key={score.id}
                            timeout={300}
                            classNames="slide"
                        >
                            <RecentScoreRow
                                score={score}
                                teamColour={
                                    TeamColours[props.teams.indexOf(team!)]
                                }
                            />
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        </RecentScoresSurface>
    );
});

interface RecentScoresProps {
    recentScores: Score[];
    teams: PPRaceTeam[];
}

export default RecentScores;
