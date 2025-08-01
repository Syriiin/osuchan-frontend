import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    YAxis,
    LabelList,
    XAxis,
} from "recharts";
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
            <BarChart
                data={data}
                layout="vertical"
                barCategoryGap="20%"
                barSize={40}
            >
                <YAxis type="category" dataKey="name" hide />
                <XAxis type="number" domain={[0, "dataMax + 1000"]} hide />
                <Bar
                    minPointSize={150}
                    dataKey="pp"
                    label={{
                        position: "right",
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
                    <LabelList
                        dataKey="name"
                        position="insideLeft"
                        fontSize={"1.5em"}
                        fill="#fff"
                    />
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
