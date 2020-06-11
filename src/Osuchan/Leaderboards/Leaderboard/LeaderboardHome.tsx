import React, { useEffect, useState, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { formatMods } from "../../../utils/formatting";
import { StoreContext } from "../../../store";
import { OsuUser, ScoreFilter } from "../../../store/models/profiles/types";
import { Leaderboard } from "../../../store/models/leaderboards/types";
import { Surface, SurfaceTitle, Button, SimpleModal, TextField, SimpleModalTitle, FormControl, FormLabel, LoadingPage } from "../../../components";
import TopScores from "./TopScores";
import Rankings from "./Rankings";
import { LeaderboardAccessType } from "../../../store/models/leaderboards/enums";
import { Gamemode, Mods } from "../../../store/models/common/enums";
import { AllowedBeatmapStatus, ScoreSet } from "../../../store/models/profiles/enums";

const LeaderboardSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const Owner = styled(Link)`
    display: inline-block;
    color: ${props => props.theme.colours.timber};
    margin-bottom: 5px;
`;

const AccessType = styled.div`
    margin-bottom: 5px;
    font-size: 0.8em;
`;

const ScoreSetLabel = styled.div`

`;

const Description = styled.div`

`;

const FiltersHeading = styled.h3`
    font-weight: 400;
`;

const FilterValue = styled.span`
    color: ${props => props.theme.colours.timber};
`;

const DeleteButton = styled(Button)`
    margin-right: 5px;
`;

const AllowPastScores = styled.div`
    color: ${props => props.theme.colours.timber};
`;

const LeaderboardFilters = (props: LeaderboardFiltersProps) => {
    const scoreFilter = props.scoreFilter;
    const gamemode = props.gamemode;

    return (
        <>
            <FiltersHeading>Score Filters</FiltersHeading>
            <ul>
                {/* Mods */}
                {scoreFilter.requiredMods !== Mods.None && (
                    <li>Required Mods: <FilterValue>{formatMods(scoreFilter.requiredMods)}</FilterValue></li>
                )}
                {scoreFilter.disqualifiedMods !== Mods.None && (
                    <li>Disqualified Mods: <FilterValue>{formatMods(scoreFilter.disqualifiedMods)}</FilterValue></li>
                )}
                {/* Beatmap status */}
                {scoreFilter.allowedBeatmapStatus === AllowedBeatmapStatus.Any && (
                    <li>Beatmap Status: <FilterValue>Ranked or Loved</FilterValue></li>
                )}
                {scoreFilter.allowedBeatmapStatus === AllowedBeatmapStatus.LovedOnly && (
                    <li>Beatmap Status: <FilterValue>Loved</FilterValue></li>
                )}
                {/* Beatmap date */}
                {scoreFilter.oldestBeatmapDate !== null && (
                    <li>Oldest Beatmap Date: <FilterValue>{scoreFilter.oldestBeatmapDate.toLocaleDateString()}</FilterValue></li>
                )}
                {scoreFilter.newestBeatmapDate !== null && (
                    <li>Newest Beatmap Date: <FilterValue>{scoreFilter.newestBeatmapDate.toLocaleDateString()}</FilterValue></li>
                )}
                {/* Score date */}
                {scoreFilter.oldestScoreDate !== null && (
                    <li>Oldest Score Date: <FilterValue>{scoreFilter.oldestScoreDate.toLocaleDateString()}</FilterValue></li>
                )}
                {scoreFilter.newestScoreDate !== null && (
                    <li>Newest Score Date: <FilterValue>{scoreFilter.newestScoreDate.toLocaleDateString()}</FilterValue></li>
                )}
                {/* Accuracy */}
                {scoreFilter.lowestAccuracy !== null && (
                    <li>Min Accuracy: <FilterValue>{scoreFilter.lowestAccuracy}</FilterValue></li>
                )}
                {scoreFilter.highestAccuracy !== null && (
                    <li>Max Accuracy: <FilterValue>{scoreFilter.highestAccuracy}</FilterValue></li>
                )}
                {/* CS */}
                {scoreFilter.lowestCs !== null && (
                    <li>Min {gamemode === Gamemode.Mania ? "Keys" : "CS"}: <FilterValue>{scoreFilter.lowestCs}</FilterValue></li>
                )}
                {scoreFilter.highestCs !== null && (
                    <li>Max {gamemode === Gamemode.Mania ? "Keys" : "CS"}: <FilterValue>{scoreFilter.highestCs}</FilterValue></li>
                )}
                {/* AR */}
                {scoreFilter.lowestAr !== null && (
                    <li>Min AR: <FilterValue>{scoreFilter.lowestAr}</FilterValue></li>
                )}
                {scoreFilter.highestAr !== null && (
                    <li>Max AR: <FilterValue>{scoreFilter.highestAr}</FilterValue></li>
                )}
                {/* OD */}
                {scoreFilter.lowestOd !== null && (
                    <li>Min OD: <FilterValue>{scoreFilter.lowestOd}</FilterValue></li>
                )}
                {scoreFilter.highestOd !== null && (
                    <li>Max OD: <FilterValue>{scoreFilter.highestOd}</FilterValue></li>
                )}
            </ul>
        </>
    );
}

interface LeaderboardFiltersProps {
    scoreFilter: ScoreFilter;
    gamemode: Gamemode;
}

const LeaderboardButtons = (props: LeaderboardButtonsProps) => {
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;
    const meStore = store.meStore;

    const handleDelete = () => detailStore.deleteLeaderboard(leaderboard!.id);
    const handleJoin = async () => {
        await meStore.joinLeaderboard(leaderboard!.id);
        await detailStore.loadLeaderboard(leaderboard!.id);
    }
    const handleLeave = async () => {
        await meStore.leaveLeaderboard(leaderboard!.id);
        await detailStore.loadLeaderboard(leaderboard!.id);
    }
    
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteUserUrl, setInviteUserUrl] = useState("");

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const userUrlRe = new RegExp(/osu.ppy.sh\/users\/(\d+)/, "g");
        let match;
        const userIds = [];
        while ((match = userUrlRe.exec(inviteUserUrl)) !== null) {
            userIds.push(parseInt(match[1]));
        }

        if (userIds.length > 0) {
            detailStore.invitePlayers(leaderboard!.id, userIds);
            setInviteDialogOpen(false);
        }
    }

    const leaderboard = props.leaderboard;
    const meOsuUser = props.meOsuUser;
    
    return (
        <>
            {/* If not global leaderboard */}
            {leaderboard.accessType !== LeaderboardAccessType.Global && meOsuUser && (
                <>
                    {/* If owner */}
                    {leaderboard.ownerId === meOsuUser.id && (
                        <>
                            {/* Delete button */}
                            <DeleteButton onClick={handleDelete}>Delete Leaderboard</DeleteButton>

                            {/* Invite button if either private or public invite-only */}
                            {(leaderboard.accessType === LeaderboardAccessType.PublicInviteOnly || leaderboard.accessType === LeaderboardAccessType.Private) && (
                                <>
                                    <Button onClick={() => setInviteDialogOpen(true)}>Invite Player</Button>

                                    {/* Invite player modal */}
                                    <SimpleModal open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                                        <SimpleModalTitle>Invite Players</SimpleModalTitle>
                                        <p>
                                            Enter osu! profile URLs to invite players.
                                            <br />
                                            URLs must be from the new site so they matches the format below.
                                        </p>
                                        <form onSubmit={handleInviteSubmit}>
                                            <FormLabel>osu! Profile URL(s)</FormLabel>
                                            <FormControl>
                                                <TextField fullWidth required placeholder="https://osu.ppy.sh/users/5701575" onChange={e => setInviteUserUrl(e.currentTarget.value)} value={inviteUserUrl} />
                                            </FormControl>
                                            <Button type="submit">Invite</Button>
                                        </form>
                                    </SimpleModal>
                                </>
                            )}
                        </>
                    )}
                    
                    {/* Join button if public or pending invite, and not member */}
                    {(leaderboard.accessType === LeaderboardAccessType.Public || meStore.invites.find(i => i.leaderboardId === leaderboard.id) !== undefined) && !meStore.memberships.find(m => m.leaderboardId === leaderboard.id) && (
                        <Button onClick={handleJoin}>Join Leaderboard</Button>
                    )}

                    {/* Leave button if member and not owner */}
                    {leaderboard.ownerId !== meOsuUser.id && meStore.memberships.find(m => m.leaderboardId === leaderboard.id) && (
                        <Button onClick={handleLeave}>Leave Leaderboard</Button>
                    )}
                </>
            )}
        </>
    );
}

interface LeaderboardButtonsProps {
    leaderboard: Leaderboard;
    meOsuUser: OsuUser | null;
}

const LeaderboardHome = (props: LeaderboardHomeProps) => {
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;
    const meStore = store.meStore;

    // use effect to fetch leaderboards data
    const leaderboardId = parseInt(props.match.params.leaderboardId);
    const { loadLeaderboard } = detailStore;
    useEffect(() => {
        loadLeaderboard(leaderboardId);
    }, [loadLeaderboard, leaderboardId]);

    const leaderboard = detailStore.leaderboard;

    // use effect to update title
    const { isLoading } = detailStore;
    useEffect(() => {
        if (isLoading) {
            document.title = "Loading...";
        } else if (leaderboard) {
            document.title = `${leaderboard.name} - osu!chan`;
        } else {
            document.title = "Leaderboard not found - osu!chan";
        }
    }, [isLoading, leaderboard]);

    return (
        <>
            {detailStore.isLoading && (
                <LoadingPage />
            )}
            {leaderboard && (
                <>
                    {/*Leaderboard Details */}
                    <LeaderboardSurface>
                        <SurfaceTitle>{leaderboard.name}</SurfaceTitle>
                        {leaderboard.accessType === LeaderboardAccessType.Global ? (
                            <AccessType>GLOBAL</AccessType>
                        ) : (
                            <>
                                <Owner to={`/users/${leaderboard.ownerId}`}>
                                    {leaderboard.owner!.username}
                                </Owner>
                                <AccessType>
                                    {leaderboard.accessType === LeaderboardAccessType.Public && "PUBLIC"}
                                    {leaderboard.accessType === LeaderboardAccessType.PublicInviteOnly && "INVITE-ONLY"}
                                    {leaderboard.accessType === LeaderboardAccessType.Private && "PRIVATE"}
                                </AccessType>
                            </>
                        )}
                        {leaderboard.scoreSet !== ScoreSet.Normal && (
                            <ScoreSetLabel>
                                {leaderboard.scoreSet === ScoreSet.NeverChoke && "Never Choke"}
                                {leaderboard.scoreSet === ScoreSet.AlwaysFullCombo && "Always Full Combo"}
                            </ScoreSetLabel>
                        )}
                        <Description>{leaderboard.description}</Description>
                        {/* Allow past scores */}
                        {!leaderboard.allowPastScores && (
                            <AllowPastScores>Scores must be set after joining</AllowPastScores>
                        )}
                        {leaderboard.scoreFilter && (
                            <LeaderboardFilters gamemode={leaderboard.gamemode} scoreFilter={leaderboard.scoreFilter} />
                        )}
                        <LeaderboardButtons leaderboard={leaderboard} meOsuUser={meStore.user?.osuUser ?? null} />
                    </LeaderboardSurface>
                    
                    {/* Top Scores */}
                    <TopScores scores={detailStore.topScores} />

                    {/* Rankings */}
                    <Rankings memberships={detailStore.rankings} />
                </>
            )}
            {!detailStore.isLoading && !leaderboard && (
                <h3>Leaderboard not found!</h3>
            )}
        </>
    );
}

interface RouteParams {
    leaderboardId: string;
}

interface LeaderboardHomeProps extends RouteComponentProps<RouteParams> {}

export default observer(LeaderboardHome);
