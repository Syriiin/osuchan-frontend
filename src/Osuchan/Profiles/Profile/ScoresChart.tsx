import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { FlexibleWidthXYPlot, HorizontalGridLines, MarkSeries, YAxis, Crosshair, MarkSeriesPoint } from "react-vis";

import { Surface } from "../../../components";
import { Score } from "../../../store/models/profiles/types";
import { observer } from "mobx-react-lite";

const ScoresChartSurface = styled(Surface)`
    padding: 20px;
    grid-area: scoreschart;
`;

const ScoresChart = (props: ScoresChartProps) => {
    const theme = useContext(ThemeContext);

    const [crosshairValues, setCrosshairValues] = useState<any[]>([]);
    const scoresData = props.scores.map((score, i) => ({ x: i, y: score.pp }));
    const sandboxScoresData = props.sandboxScores.map((score, i) => ({ x: i, y: score.pp }));

    return (
        <ScoresChartSurface>
            <FlexibleWidthXYPlot animation height={300} onMouseLeave={() => setCrosshairValues([])}>
                <HorizontalGridLines />
                <MarkSeries
                    data={scoresData}
                    color={theme.colours.pillow}
                    onNearestX={(value, { index }) => setCrosshairValues(props.sandboxMode ? [value, sandboxScoresData[index]] : [value])}
                />
                {props.sandboxMode && (
                    <MarkSeries data={sandboxScoresData} color={theme.colours.timber} />
                )}
                <YAxis />
                <Crosshair
                    values={crosshairValues}
                    titleFormat={(d: MarkSeriesPoint[]) => ({
                        title: "#",
                        value: d[0].x as number + 1
                    })}
                    itemsFormat={props.sandboxMode ? (d: MarkSeriesPoint[]) => ([{
                        title: "Real",
                        value: `${(d[0].y as number).toLocaleString("en", { maximumFractionDigits: 0 })}pp`
                    }, {
                        title: "Sandbox",
                        value: d[1] ? `${(d[1].y as number).toLocaleString("en", { maximumFractionDigits: 0 })}pp` : "-"
                    }]) : (d: MarkSeriesPoint[]) => ([{
                        title: "PP",
                        value: `${(d[0].y as number).toLocaleString("en", { maximumFractionDigits: 0 })}pp`
                    }])}
                />
            </FlexibleWidthXYPlot>
        </ScoresChartSurface>
    );
}

interface ScoresChartProps {
    scores: Score[];
    sandboxScores: Score[];
    sandboxMode: boolean;
}

export default observer(ScoresChart);
