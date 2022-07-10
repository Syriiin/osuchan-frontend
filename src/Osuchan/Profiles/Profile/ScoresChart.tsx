import { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

import { Surface } from "../../../components";
import { Score } from "../../../store/models/profiles/types";
import { observer } from "mobx-react-lite";

const ScoresChartSurface = styled(Surface)`
    padding: 20px;
    grid-area: scoreschart;
    height: 300px;
`;

const ScoresChart = observer((props: ScoresChartProps) => {
    const theme = useContext(ThemeContext);

    const scoresData = props.scores.map((score, i) => ({
        x: i + 1,
        pp: score.performanceTotal,
        sandboxPp: props.sandboxScores[i]?.performanceTotal,
    }));

    return (
        <ScoresChartSurface>
            <ResponsiveContainer>
                <LineChart data={scoresData}>
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="#"
                        domain={[0, 100]}
                    />
                    <YAxis
                        type="number"
                        name="PP"
                        unit="pp"
                        domain={["auto", "auto"]}
                    />
                    <CartesianGrid vertical={false} />
                    <Tooltip
                        labelFormatter={(label) => `# ${label}`}
                        formatter={(value: number) =>
                            value.toLocaleString("en", {
                                maximumFractionDigits: 0,
                            })
                        }
                        cursor={{
                            strokeDasharray: "3 3",
                        }}
                        itemStyle={{
                            color: "#fff",
                        }}
                        contentStyle={{
                            color: "#fff",
                            backgroundColor: theme.colours.foreground,
                            borderRadius: "5px",
                            border: "unset",
                        }}
                    />
                    <Line
                        name={props.sandboxMode ? "Real" : "PP"}
                        dataKey="pp"
                        unit="pp"
                        fill={theme.colours.pillow}
                        stroke={theme.colours.pillow}
                        activeDot={{ r: 5 }}
                    />
                    {props.sandboxMode && (
                        <Line
                            name="Sandbox"
                            dataKey="sandboxPp"
                            unit="pp"
                            fill={theme.colours.timber}
                            stroke={theme.colours.timber}
                            activeDot={{ r: 5 }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </ScoresChartSurface>
    );
});

interface ScoresChartProps {
    scores: Score[];
    sandboxScores: Score[];
    sandboxMode: boolean;
}

export default ScoresChart;
