import React, { useState } from "react";
import styled, { ThemeProps, DefaultTheme, withTheme } from "styled-components";
import { FlexibleWidthXYPlot, HorizontalGridLines, MarkSeries, YAxis, Crosshair, MarkSeriesPoint } from "react-vis";

import { Surface } from "../../../components";
import { Score } from "../../../store/models/profiles/types";
import { observer } from "mobx-react-lite";

const ScoresChartSurface = styled(Surface)`
    padding: 20px;
    grid-area: scoreschart;
`;

function ScoresChart(props: ScoresChartProps) {
    const [crosshairValues, setCrosshairValues] = useState<any[]>([]);
    const scoresData = props.scores.map((score, i) => ({ x: i, y: score.pp }));
    const sandboxScoresData = props.sandboxScores.map((score, i) => ({ x: i, y: score.pp }));

    return (
        <ScoresChartSurface>
            <FlexibleWidthXYPlot animation height={300} onMouseLeave={() => setCrosshairValues([])}>
                <HorizontalGridLines />
                <MarkSeries
                    data={scoresData}
                    color={props.theme.colours.pillow}
                    onNearestX={(value, { index }) => setCrosshairValues(props.sandboxMode ? [value, sandboxScoresData[index]] : [value])}
                />
                {props.sandboxMode && (
                    <MarkSeries data={sandboxScoresData} color={props.theme.colours.timber} />
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
                        value: d[0].y
                    }, {
                        title: "Sandbox",
                        value: d[1].y
                    }]) : (d: MarkSeriesPoint[]) => ([{
                        title: "PP",
                        value: d[0].y
                    }])}
                />
            </FlexibleWidthXYPlot>
        </ScoresChartSurface>
    );
}

interface ScoresChartProps extends ThemeProps<DefaultTheme> {
    scores: Score[];
    sandboxScores: Score[];
    sandboxMode: boolean;
}

export default withTheme(observer(ScoresChart));
