import React from "react";
import styled from "styled-components";

import { Surface, DataTable, DataCell } from "../../../components";
import { UserStats } from "../../../store/models/profiles/types";
import { formatTime } from "../../../utils/formatting";

const ScoreStyleSurface = styled(Surface)`
    padding: 20px;
    grid-area: scorestyle;
`;

function ScoreStyle(props: ScoreStyleProps) {
    return (
        <ScoreStyleSurface>
            <DataTable>
                <tr>
                    <td>Accuracy</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{props.userStats.scoreStyleAccuracy.toLocaleString("en", { maximumFractionDigits: 2 })}%</DataCell>
                    )}
                    <DataCell>{props.userStats.scoreStyleAccuracy.toLocaleString("en", { maximumFractionDigits: 2 })}%</DataCell>
                </tr>
                <tr>
                    <td>BPM</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{props.userStats.scoreStyleBpm.toLocaleString("en", { maximumFractionDigits: 0 })}</DataCell>
                    )}
                    <DataCell>{props.userStats.scoreStyleBpm.toLocaleString("en", { maximumFractionDigits: 0 })}</DataCell>
                </tr>
                <tr>
                    <td>Length</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{formatTime(props.userStats.scoreStyleLength)}</DataCell>
                    )}
                    <DataCell>{formatTime(props.userStats.scoreStyleLength)}</DataCell>
                </tr>
                <tr>
                    <td>Circle Size</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{props.userStats.scoreStyleCs.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                    )}
                    <DataCell>{props.userStats.scoreStyleCs.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                </tr>
                <tr>
                    <td>Approach Rate</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{props.userStats.scoreStyleAr.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                    )}
                    <DataCell>{props.userStats.scoreStyleAr.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
                </tr>
                <tr>
                    <td>Overall Difficulty</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{props.userStats.scoreStyleOd.toLocaleString("en", { maximumFractionDigits: 1 })}</DataCell>
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

export default ScoreStyle;
