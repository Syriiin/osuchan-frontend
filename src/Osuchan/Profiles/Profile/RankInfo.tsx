import React, { useContext } from "react";
import styled from "styled-components";

import { Surface, DataCell, DataTable } from "../../../components";
import { UserStats, OsuUser } from "../../../store/models/profiles/types";
import { StoreContext } from "../../../store";
import { observer } from "mobx-react-lite";

const RankInfoSurface = styled(Surface)`
    padding: 20px;
    grid-area: rankinfo;
`;

function RankInfo(props: RankInfoProps) {
    const store = useContext(StoreContext);
    const usersStore = store.usersStore;

    return (
        <RankInfoSurface>
            <DataTable>
                <tr>
                    <td>Performance</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{usersStore.sandboxPerformance.toLocaleString("en", { maximumFractionDigits: 0 })}pp</DataCell>
                    )}
                    <DataCell>{props.userStats.pp.toLocaleString("en", { maximumFractionDigits: 0 })}pp</DataCell>
                </tr>
                <tr>
                    <td>No-choke Performance</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>{usersStore.sandboxNochokePerformance.toLocaleString("en", { maximumFractionDigits: 0 })}pp</DataCell>
                    )}
                    <DataCell>{props.userStats.nochokePp.toLocaleString("en", { maximumFractionDigits: 0 })}pp</DataCell>
                </tr>
                <tr>
                    <td>Rank</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>-</DataCell>
                    )}
                    <DataCell>#{props.userStats.rank.toLocaleString("en", { maximumFractionDigits: 0 })}</DataCell>
                </tr>
                <tr>
                    <td>Country Rank</td>
                    {props.sandboxMode && (
                        <DataCell highlighted>-</DataCell>
                    )}
                    <DataCell>#{props.userStats.countryRank} {props.osuUser.country}</DataCell>
                </tr>
            </DataTable>
        </RankInfoSurface>
    );
}

interface RankInfoProps {
    osuUser: OsuUser;
    userStats: UserStats;
    sandboxMode: boolean;
}

export default observer(RankInfo);
