import styled from "styled-components";

import { Surface, DataTable, DataCell, NumberFormat } from "../../../components";
import { UserStats } from "../../../store/models/profiles/types";
import { formatTime } from "../../../utils/formatting";
import { observer } from "mobx-react-lite";
import { Gamemode } from "../../../store/models/common/enums";
import { useStore } from "../../../utils/hooks";

const ScoreStyleSurface = styled(Surface)`
    padding: 20px;
    grid-area: scorestyle;
`;

const ScoreStyle = observer((props: ScoreStyleProps) => {
    const store = useStore();
    const usersStore = store.usersStore;
    const userStats = usersStore.currentUserStats!;

    return (
        <ScoreStyleSurface>
            <DataTable>
                <tr>
                    <td>Accuracy</td>
                    {props.sandboxMode && (
                        <DataCell highlighted><NumberFormat value={usersStore.sandboxScoreStyleAccuracy} decimalPlaces={2} />%</DataCell>
                    )}
                    <DataCell><NumberFormat value={props.userStats.scoreStyleAccuracy} decimalPlaces={2} />%</DataCell>
                </tr>
                <tr>
                    <td>BPM</td>
                    {props.sandboxMode && (
                        <DataCell highlighted><NumberFormat value={usersStore.sandboxScoreStyleBpm} decimalPlaces={0} /></DataCell>
                    )}
                    <DataCell><NumberFormat value={props.userStats.scoreStyleBpm} decimalPlaces={0} /></DataCell>
                </tr>
                <tr>
                    <td>Length</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{formatTime(usersStore.sandboxScoreStyleLength)}</DataCell>
                    )}
                    <DataCell>{formatTime(props.userStats.scoreStyleLength)}</DataCell>
                </tr>
                {[Gamemode.Standard, Gamemode.Catch, Gamemode.Mania].includes(userStats.gamemode) && (
                    <tr>
                        <td>{userStats.gamemode === Gamemode.Mania ? "Keys" : "Circle Size"}</td>
                        {props.sandboxMode && (
                            <DataCell highlighted><NumberFormat value={usersStore.sandboxScoreStyleCircleSize} decimalPlaces={1} /></DataCell>
                        )}
                        <DataCell><NumberFormat value={props.userStats.scoreStyleCs} decimalPlaces={1} /></DataCell>
                    </tr>
                )}
                {[Gamemode.Standard, Gamemode.Catch].includes(userStats.gamemode) && (
                    <tr>
                        <td>Approach Rate</td>
                        {props.sandboxMode && (
                            <DataCell highlighted><NumberFormat value={usersStore.sandboxScoreStyleApproachRate} decimalPlaces={1} /></DataCell>
                        )}
                        <DataCell><NumberFormat value={props.userStats.scoreStyleAr} decimalPlaces={1} /></DataCell>
                    </tr>
                )}
                <tr>
                    <td>Overall Difficulty</td>
                    {props.sandboxMode && (
                        <DataCell highlighted><NumberFormat value={usersStore.sandboxScoreStyleOverallDifficulty} decimalPlaces={1} /></DataCell>
                    )}
                    <DataCell><NumberFormat value={props.userStats.scoreStyleOd} decimalPlaces={1} /></DataCell>
                </tr>
            </DataTable>
        </ScoreStyleSurface>
    );
});

interface ScoreStyleProps {
    userStats: UserStats;
    sandboxMode: boolean;
}

export default ScoreStyle;
