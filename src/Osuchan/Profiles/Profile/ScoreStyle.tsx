import React, { useContext } from "react";
import styled from "styled-components";

import { Surface, DataTable, DataCell } from "../../../components";
import { UserStats } from "../../../store/models/profiles/types";
import { formatTime } from "../../../utils/formatting";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../../../store";
import { Gamemode } from "../../../store/models/common/enums";

const ScoreStyleSurface = styled(Surface)`
    padding: 20px;
    grid-area: scorestyle;
`;

function ScoreStyle(props: ScoreStyleProps) {
    const store = useContext(StoreContext);
    const usersStore = store.usersStore;
    const userStats = usersStore.currentUserStats as UserStats;

    return (
        <ScoreStyleSurface>
            <DataTable>
                <tr>
                    <td>Accuracy</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{usersStore.sandboxScoreStyleAccuracy.toLocaleString("en", { maximumFractionDigits: 2 })}%</DataCell>
                    )}
                    <DataCell>{props.userStats.scoreStyleAccuracy.toLocaleString("en", { maximumFractionDigits: 2 })}%</DataCell>
                </tr>
                <tr>
                    <td>BPM</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{usersStore.sandboxScoreStyleBpm.toLocaleString("en", { maximumFractionDigits: 0 })}</DataCell>
                    )}
                    <DataCell>{props.userStats.scoreStyleBpm.toLocaleString("en", { maximumFractionDigits: 0 })}</DataCell>
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
                            <DataCell highlighted>{usersStore.sandboxScoreStyleCircleSize.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                        )}
                        <DataCell>{props.userStats.scoreStyleCs.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                    </tr>
                )}
                {[Gamemode.Standard, Gamemode.Catch].includes(userStats.gamemode) && (
                    <tr>
                        <td>Approach Rate</td>
                        {props.sandboxMode && (
                            <DataCell highlighted>{usersStore.sandboxScoreStyleApproachRate.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                        )}
                        <DataCell>{props.userStats.scoreStyleAr.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                    </tr>
                )}
                <tr>
                    <td>Overall Difficulty</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{usersStore.sandboxScoreStyleOverallDifficulty.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                    )}
                    <DataCell>{props.userStats.scoreStyleOd.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                </tr>
            </DataTable>
        </ScoreStyleSurface>
    );
}

interface ScoreStyleProps {
    userStats: UserStats;
    sandboxMode: boolean;
}

export default observer(ScoreStyle);
