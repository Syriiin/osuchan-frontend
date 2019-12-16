import React, { useEffect, useState, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { formatMods } from "../../../utils/formatting";
import { StoreContext } from "../../../store";
import { OsuUser } from "../../../store/models/profiles/types";
import { Leaderboard } from "../../../store/models/leaderboards/types";
import { Surface, SurfaceTitle, Button, SimpleModal, TextField, SimpleModalTitle, FormControl, FormLabel, LoadingPage } from "../../../components";
import TopScores from "./TopScores";
import Rankings from "./Rankings";
import { AllowedBeatmapStatus, LeaderboardAccessType } from "../../../store/models/leaderboards/enums";
import { Gamemode, Mods } from "../../../store/models/common/enums";

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

const Description = styled.div`

`;

const FilterValue = styled.span`
    color: ${props => props.theme.colours.timber};
`;

const DeleteButton = styled(Button)`
    margin-right: 5px;
`;

function LeaderboardFilters(props: LeaderboardFiltersProps) {
    const leaderboard = props.leaderboard;

    return (
        <ul>
            {/* Allow past scores */}
            {!leaderboard.allowPastScores && (
                <li><FilterValue>Scores must be made after joining leaderboard</FilterValue></li>
            )}
            {/* Mods */}
            {leaderboard.requiredMods !== Mods.None && (
                <li>Required Mods: <FilterValue>{formatMods(leaderboard.requiredMods)}</FilterValue></li>
            )}
            {leaderboard.disqualifiedMods !== Mods.None && (
                <li>Disqualified Mods: <FilterValue>{formatMods(leaderboard.disqualifiedMods)}</FilterValue></li>
            )}
            {/* Beatmap status */}
            {leaderboard.allowedBeatmapStatus === AllowedBeatmapStatus.Any && (
                <li>Beatmap Status: <FilterValue>Ranked or Loved</FilterValue></li>
            )}
            {leaderboard.allowedBeatmapStatus === AllowedBeatmapStatus.LovedOnly && (
                <li>Beatmap Status: <FilterValue>Loved</FilterValue></li>
            )}
            {/* Beatmap date */}
            {leaderboard.oldestBeatmapDate !== null && (
                <li>Oldest Beatmap Date: <FilterValue>{leaderboard.oldestBeatmapDate.toLocaleDateString()}</FilterValue></li>
            )}
            {leaderboard.newestBeatmapDate !== null && (
                <li>Newest Beatmap Date: <FilterValue>{leaderboard.newestBeatmapDate.toLocaleDateString()}</FilterValue></li>
            )}
            {/* Score date */}
            {leaderboard.oldestScoreDate !== null && (
                <li>Oldest Score Date: <FilterValue>{leaderboard.oldestScoreDate.toLocaleDateString()}</FilterValue></li>
            )}
            {leaderboard.newestScoreDate !== null && (
                <li>Newest Score Date: <FilterValue>{leaderboard.newestScoreDate.toLocaleDateString()}</FilterValue></li>
            )}
            {/* Accuracy */}
            {leaderboard.lowestAccuracy !== null && (
                <li>Min Accuracy: <FilterValue>{leaderboard.lowestAccuracy}</FilterValue></li>
            )}
            {leaderboard.highestAccuracy !== null && (
                <li>Max Accuracy: <FilterValue>{leaderboard.highestAccuracy}</FilterValue></li>
            )}
            {/* CS */}
            {leaderboard.lowestCs !== null && (
                <li>Min {leaderboard.gamemode === Gamemode.Mania ? "Keys" : "CS"}: <FilterValue>{leaderboard.lowestCs}</FilterValue></li>
            )}
            {leaderboard.highestCs !== null && (
                <li>Max {leaderboard.gamemode === Gamemode.Mania ? "Keys" : "CS"}: <FilterValue>{leaderboard.highestCs}</FilterValue></li>
            )}
            {/* AR */}
            {leaderboard.lowestAr !== null && (
                <li>Min AR: <FilterValue>{leaderboard.lowestAr}</FilterValue></li>
            )}
            {leaderboard.highestAr !== null && (
                <li>Max AR: <FilterValue>{leaderboard.highestAr}</FilterValue></li>
            )}
            {/* OD */}
            {leaderboard.lowestOd !== null && (
                <li>Min OD: <FilterValue>{leaderboard.lowestOd}</FilterValue></li>
            )}
            {leaderboard.highestOd !== null && (
                <li>Max OD: <FilterValue>{leaderboard.highestOd}</FilterValue></li>
            )}
        </ul>
    );
}

interface LeaderboardFiltersProps {
    leaderboard: Leaderboard;
}

function LeaderboardButtons(props: LeaderboardButtonsProps) {
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
    meOsuUser: OsuUser;
}

function LeaderboardHome(props: LeaderboardHomeProps) {
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
                        <Description>{leaderboard.description}</Description>
                        <LeaderboardFilters leaderboard={leaderboard} />
                        <LeaderboardButtons leaderboard={leaderboard} meOsuUser={meStore.osuUser!} />
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
