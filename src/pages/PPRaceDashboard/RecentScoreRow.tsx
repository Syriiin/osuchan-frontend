import { useState } from "react";
import styled from "styled-components";
import { Score } from "../../store/models/profiles/types";

import { observer } from "mobx-react-lite";
import { Row, NumberFormat, ScoreModal } from "../../components";

const ScoreRowWrapper = styled(Row)<{ teamColour: string }>`
    background-color: ${(props) => props.teamColour};
`;

const Player = styled.div`
    flex: 1;
    font-weight: bold;
`;

const Performance = styled.div`
    flex: 1;
    text-align: right;
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
