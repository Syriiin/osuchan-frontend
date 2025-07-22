import { useState } from "react";
import styled from "styled-components";
import { Score } from "../../store/models/profiles/types";

import { observer } from "mobx-react-lite";
import { Row, NumberFormat, ScoreModal, ShortTimeAgo } from "../../components";

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

export default RecentScoreRow;
