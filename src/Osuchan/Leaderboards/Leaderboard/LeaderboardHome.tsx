import React, { useEffect, useContext } from "react";
import { useParams, Route, useRouteMatch, useHistory, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { formatMods, formatTime } from "../../../utils/formatting";
import { StoreContext } from "../../../store";
import { OsuUser, ScoreFilter } from "../../../store/models/profiles/types";
import { Leaderboard } from "../../../store/models/leaderboards/types";
import { Surface, SurfaceTitle, Button, LoadingPage, UnstyledLink, SurfaceHeaderContainer } from "../../../components";
import TopScores from "./TopScores";
import Rankings from "./Rankings";
import { LeaderboardAccessType } from "../../../store/models/leaderboards/enums";
import { Gamemode, Mods } from "../../../store/models/common/enums";
import { AllowedBeatmapStatus, ScoreSet } from "../../../store/models/profiles/enums";
import { scoreFilterIsDefault } from "../../../utils/osuchan";
import { gamemodeIdFromName } from "../../../utils/osu";
import ManageInvitesModal from "./ManageInvitesModal";
import MemberModal from "./MemberModal";
import { ResourceStatus } from "../../../store/status";

const LeaderboardSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const LeaderboardIcon = styled.img`
    max-width: 128px;
    max-height: 128px;
    border-radius: 5px;
`;

const ArchivedNotice = styled.div`
    font-size: 1.5em;
    color: ${props => props.theme.colours.negative};
    margin-bottom: 10px;
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

`;

const ArchiveButton = styled(Button)`
    margin-right: 5px;
`;

const RestoreButton = styled(Button)`
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
                {/* Length */}
                {scoreFilter.lowestLength !== null && (
                    <li>Min Length: <FilterValue>{formatTime(scoreFilter.lowestLength)}</FilterValue></li>
                )}
                {scoreFilter.highestLength !== null && (
                    <li>Max Length: <FilterValue>{formatTime(scoreFilter.highestLength)}</FilterValue></li>
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

const LeaderboardButtons = observer((props: LeaderboardButtonsProps) => {
    const match = useRouteMatch();
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;
    const meStore = store.meStore;
    
    const leaderboard = props.leaderboard;
    const meOsuUser = props.meOsuUser;
    
    const handleJoin = async () => {
        await detailStore.joinLeaderboard();
        await detailStore.reloadLeaderboard();
    }
    const handleLeave = async () => {
        await detailStore.leaveLeaderboard();
        await detailStore.reloadLeaderboard();
    }
    
    return (
        <>
            {/* If not global leaderboard */}
            {leaderboard.accessType !== LeaderboardAccessType.Global && meOsuUser && (
                <>
                    {/* If owner */}
                    {leaderboard.ownerId === meOsuUser.id && (
                        <>
                            {/* Delete / archive / restore buttons */}
                            {leaderboard.archived ? (
                                <>
                                    <RestoreButton positive isLoading={detailStore.isRestoringLeaderboard} action={() => detailStore.restoreLeaderboard()}>Restore Leaderboard</RestoreButton>
                                    <DeleteButton negative isLoading={detailStore.isDeletingLeaderboard} action={() => detailStore.deleteLeaderboard()} confirmationMessage="Are you sure you want to delete this leaderboard?">Delete Leaderboard</DeleteButton>
                                </>
                            ) : (
                                <>
                                    <ArchiveButton negative isLoading={detailStore.isArchivingLeaderboard} action={() => detailStore.archiveLeaderboard()} confirmationMessage="Are you sure you want to archive this leaderboard?">Archive Leaderboard</ArchiveButton>

                                    {/* Manage invites button if either private or public invite-only */}
                                    {(leaderboard.accessType === LeaderboardAccessType.PublicInviteOnly || leaderboard.accessType === LeaderboardAccessType.Private) && (
                                        <UnstyledLink to={`${match.url}/invites`}>
                                            <Button type="button">Manage Invites</Button>
                                        </UnstyledLink>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    
                    {/* Join button if public or pending invite, and not member */}
                    {(leaderboard.accessType === LeaderboardAccessType.Public || meStore.invites.find(i => i.leaderboardId === leaderboard.id) !== undefined) && detailStore.userMembership === null && (
                        <Button type="button" positive isLoading={detailStore.isJoiningLeaderboard} action={handleJoin}>Join Leaderboard</Button>
                    )}

                    {/* Leave button if member and not owner */}
                    {leaderboard.ownerId !== meOsuUser.id && detailStore.userMembership !== null && (
                        <Button type="button" negative isLoading={detailStore.isLeavingLeaderboard} action={handleLeave} confirmationMessage="Are you sure you want to leave this leaderboard?">Leave Leaderboard</Button>
                    )}
                </>
            )}
        </>
    );
});

interface LeaderboardButtonsProps {
    leaderboard: Leaderboard;
    meOsuUser: OsuUser | null;
}

const LeaderboardHome = observer(() => {
    const match = useRouteMatch();
    const history = useHistory();
    const params = useParams<RouteParams>();
    const leaderboardType = params.leaderboardType;
    const gamemode = gamemodeIdFromName(params.gamemode);
    const leaderboardId = parseInt(params.leaderboardId);

    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;
    const meStore = store.meStore;

    // use effect to fetch leaderboards data
    const { loadLeaderboard } = detailStore;
    useEffect(() => {
        loadLeaderboard(leaderboardType, gamemode, leaderboardId);
    }, [loadLeaderboard, leaderboardType, gamemode, leaderboardId]);
    
    const userId = meStore.user?.osuUserId;
    const { loadUserMembership } = detailStore;
    useEffect(() => {
        if (userId) {
            loadUserMembership(userId);
        }
    }, [loadUserMembership, userId]);

    const leaderboard = detailStore.leaderboard;

    // use effect to update title
    const { loadingStatus } = detailStore;
    useEffect(() => {
        if (loadingStatus === ResourceStatus.Loading) {
            document.title = "Loading...";
        } else if (leaderboard) {
            document.title = `${leaderboard.name} - osu!chan`;
        } else {
            document.title = "Leaderboard not found - osu!chan";
        }
    }, [loadingStatus, leaderboard]);

    return (
        <>
            {detailStore.loadingStatus === ResourceStatus.Loading && (
                <LoadingPage />
            )}
            {leaderboard && (
                <>
                    {/*Leaderboard Details */}
                    <LeaderboardSurface>
                        <SurfaceHeaderContainer>
                            <SurfaceTitle>{leaderboard.name}</SurfaceTitle>
                            <LeaderboardIcon src={leaderboard.iconUrl} />
                        </SurfaceHeaderContainer>
                        {leaderboard.archived && (
                            <ArchivedNotice>ARCHIVED</ArchivedNotice>
                        )}
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
                        {leaderboard.scoreFilter && !scoreFilterIsDefault(leaderboard.scoreFilter) && (
                            <LeaderboardFilters gamemode={leaderboard.gamemode} scoreFilter={leaderboard.scoreFilter} />
                        )}
                        <LeaderboardButtons leaderboard={leaderboard} meOsuUser={meStore.user?.osuUser ?? null} />
                    </LeaderboardSurface>
                    
                    {/* Top Scores */}
                    <TopScores scores={detailStore.leaderboardScores} />

                    {/* Rankings */}
                    <Rankings memberships={detailStore.rankings} />
                </>
            )}
            {detailStore.loadingStatus === ResourceStatus.Error && (
                <h3>Leaderboard not found!</h3>
            )}
            <Route exact path={`${match.path}/invites`}>
                {props => (
                    <>
                        <ManageInvitesModal open={props.match !== null && leaderboard !== null} onClose={() => history.push(match.url)} />
                        {props.match !== null && leaderboard && leaderboard.ownerId !== meStore.user?.osuUserId && (
                            <Redirect to={match.url} />
                        )}
                    </>
                )}
            </Route>
            <Route exact path={`${match.path}/members/:userId`}>
                {props => (
                    <MemberModal open={props.match !== null && leaderboard !== null} onClose={() => history.push(match.url)} />
                )}
            </Route>
        </>
    );
});

interface RouteParams {
    leaderboardType: "global" | "community";
    gamemode: "osu" | "taiko" | "catch" | "mania";
    leaderboardId: string;
}

export default LeaderboardHome;
