import { ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { PPRaceTeam } from "../../store/models/ppraces/types";
import { observer } from "mobx-react-lite";
import { TeamColours } from ".";

const PPChart = observer((props: PPChartProps) => {
    const data = props.teams.map((team) => ({
        name: team.name,
        pp: team.totalPp,
    }));
    return (
        // 99% to fix resizing down https://github.com/recharts/recharts/issues/172
        <ResponsiveContainer width="99%" height="99%">
            <BarChart data={data}>
                <Bar
                    dataKey="pp"
                    label={{
                        position: "top",
                        formatter: (value: number) =>
                            `${value.toLocaleString("en", {
                                maximumFractionDigits: 0,
                            })}pp`,
                        style: {
                            fontSize: "1.5em",
                            fontWeight: "bold",
                            fill: "#fff",
                        },
                    }}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TeamColours[index]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
});

interface PPChartProps {
    teams: PPRaceTeam[];
}

export default PPChart;
