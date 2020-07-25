import React, { useEffect, useContext, useState } from "react";
import { useParams, Route, useRouteMatch, useHistory, Redirect } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import { formatTime, formatGamemodeName } from "../../../utils/formatting";
import { StoreContext } from "../../../store";
import { ScoreFilter } from "../../../store/models/profiles/types";
import { Surface, Button, LoadingPage, UnstyledLink, Label, LabelGroup, VerticalButtonGroup, ModIcons } from "../../../components";
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
import EditLeaderboardModal from "./EditLeaderboardModal";

const LeaderboardSurface = styled(Surface)`
    display: flex;
    justify-content: space-between;
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const LeaderboardDetailsContainer = styled.div`
    max-width: 400px;
`;

const LeaderboardInfoContainer = styled.div`
    display: flex;
    align-items: center;
    height: 128px;
`;

const LeaderboardIcon = styled.img`
    max-width: 128px;
    max-height: 128px;
    border-radius: 5px;
    margin-right: 20px;
`;

const LeaderboardInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
`;

const LeaderboardInfoRow = styled.div`

`;

const LeaderboardName = styled.div`
    font-size: 2em;
`;

const Owner = styled.span`
    color: ${props => props.theme.colours.timber};
`;

const Description = styled.div`
    margin-top: 20px;
`;

const LeaderboardScoreFilterContainer = styled.div`
    margin-left: 20px;
    margin-right: 20px;
    max-width: 360px;
`;

const ScoreFilters = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 5px;
    background-color: ${props => props.theme.colours.foreground};
    padding: 5px;
    border-radius: 5px;
    min-width: 300px;
`;

const ScoreFilterName = styled.div`
    display: flex;
    align-items: center;
`;

const ScoreFilterValue = styled.div`
    color: ${props => props.theme.colours.timber};
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
`;

const LeaderboardButtonsContainer = styled.div`

`;

const LeaderboardFilters = (props: LeaderboardFiltersProps) => {
    const { scoreFilter, gamemode } = props;

    return (
        <ScoreFilters>
            {/* Mods */}
            {scoreFilter.requiredMods !== Mods.None && (
                <>
                    <ScoreFilterName>Required Mods</ScoreFilterName>
                    <ScoreFilterValue><ModIcons bitwiseMods={scoreFilter.requiredMods} small /></ScoreFilterValue>
                </>
            )}
            {scoreFilter.disqualifiedMods !== Mods.None && (
                <>
                    <ScoreFilterName>Disqualified Mods</ScoreFilterName>
                    <ScoreFilterValue><ModIcons bitwiseMods={scoreFilter.disqualifiedMods} small /></ScoreFilterValue>
                </>
            )}
            {/* Beatmap status */}
            {scoreFilter.allowedBeatmapStatus === AllowedBeatmapStatus.Any && (
                <>
                    <ScoreFilterName>Beatmap Status</ScoreFilterName>
                    <ScoreFilterValue>Ranked or Loved</ScoreFilterValue>
                </>
            )}
            {scoreFilter.allowedBeatmapStatus === AllowedBeatmapStatus.LovedOnly && (
                <>
                    <ScoreFilterName>Beatmap Status</ScoreFilterName>
                    <ScoreFilterValue>Loved</ScoreFilterValue>
                </>
            )}
            {/* Beatmap date */}
            {scoreFilter.oldestBeatmapDate !== null && (
                <>
                    <ScoreFilterName>Oldest Beatmap Date</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.oldestBeatmapDate.toLocaleDateString()}</ScoreFilterValue>
                </>
            )}
            {scoreFilter.newestBeatmapDate !== null && (
                <>
                    <ScoreFilterName>Newest Beatmap Date</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.newestBeatmapDate.toLocaleDateString()}</ScoreFilterValue>
                </>
            )}
            {/* Score date */}
            {scoreFilter.oldestScoreDate !== null && (
                <>
                    <ScoreFilterName>Oldest Score Date</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.oldestScoreDate.toLocaleDateString()}</ScoreFilterValue>
                </>
            )}
            {scoreFilter.newestScoreDate !== null && (
                <>
                    <ScoreFilterName>Newest Score Date</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.newestScoreDate.toLocaleDateString()}</ScoreFilterValue>
                </>
            )}
            {/* Accuracy */}
            {scoreFilter.lowestAccuracy !== null && (
                <>
                    <ScoreFilterName>Min Accuracy</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.lowestAccuracy}%</ScoreFilterValue>
                </>
            )}
            {scoreFilter.highestAccuracy !== null && (
                <>
                    <ScoreFilterName>Max Accuracy</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.highestAccuracy}%</ScoreFilterValue>
                </>
            )}
            {/* Length */}
            {scoreFilter.lowestLength !== null && (
                <>
                    <ScoreFilterName>Min Length</ScoreFilterName>
                    <ScoreFilterValue>{formatTime(scoreFilter.lowestLength)}</ScoreFilterValue>
                </>
            )}
            {scoreFilter.highestLength !== null && (
                <>
                    <ScoreFilterName>Max Length</ScoreFilterName>
                    <ScoreFilterValue>{formatTime(scoreFilter.highestLength)}</ScoreFilterValue>
                </>
            )}
            {/* CS */}
            {scoreFilter.lowestCs !== null && (
                <>
                    <ScoreFilterName>Min {gamemode === Gamemode.Mania ? "Keys" : "CS"}</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.lowestCs}</ScoreFilterValue>
                </>
            )}
            {scoreFilter.highestCs !== null && (
                <>
                    <ScoreFilterName>Max {gamemode === Gamemode.Mania ? "Keys" : "CS"}</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.highestCs}</ScoreFilterValue>
                </>
            )}
            {/* AR */}
            {scoreFilter.lowestAr !== null && (
                <>
                    <ScoreFilterName>Min AR</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.lowestAr}</ScoreFilterValue>
                </>
            )}
            {scoreFilter.highestAr !== null && (
                <>
                    <ScoreFilterName>Max AR</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.highestAr}</ScoreFilterValue>
                </>
            )}
            {/* OD */}
            {scoreFilter.lowestOd !== null && (
                <>
                    <ScoreFilterName>Min OD</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.lowestOd}</ScoreFilterValue>
                </>
            )}
            {scoreFilter.highestOd !== null && (
                <>
                    <ScoreFilterName>Max OD</ScoreFilterName>
                    <ScoreFilterValue>{scoreFilter.highestOd}</ScoreFilterValue>
                </>
            )}
        </ScoreFilters>
    );
}

interface LeaderboardFiltersProps {
    scoreFilter: ScoreFilter;
    gamemode: Gamemode;
}

const LeaderboardButtons = observer(() => {
    const match = useRouteMatch();
    const store = useContext(StoreContext);
    const detailStore = store.leaderboardsStore.detailStore;
    const meStore = store.meStore;
    
    const { leaderboard } = detailStore;
    const { user } = meStore;
    
    const [editModalOpen, setEditModalOpen] = useState(false);

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
            <VerticalButtonGroup>
                {/* Join button if public or pending invite, and not member */}
                {(leaderboard!.accessType === LeaderboardAccessType.Public || meStore.invites.find(i => i.leaderboardId === leaderboard!.id) !== undefined) && detailStore.userMembership === null && (
                    <Button type="button" positive isLoading={detailStore.isJoiningLeaderboard} action={handleJoin}>Join Leaderboard</Button>
                )}
        
                {/* If owner */}
                {leaderboard!.ownerId === user?.osuUserId && (
                    <>
                        {/* Edit button */}
                        <Button action={() => setEditModalOpen(true)}>Edit Leaderboard</Button>

                        {/* Delete / archive / restore buttons */}
                        {leaderboard!.archived ? (
                            <>
                                <Button positive isLoading={detailStore.isRestoringLeaderboard} action={() => detailStore.restoreLeaderboard()}>Restore Leaderboard</Button>
                                <Button negative isLoading={detailStore.isDeletingLeaderboard} action={() => detailStore.deleteLeaderboard()} confirmationMessage="Are you sure you want to delete this leaderboard?">Delete Leaderboard</Button>
                            </>
                        ) : (
                            <>
                                {/* Manage invites button if either private or public invite-only */}
                                {(leaderboard!.accessType === LeaderboardAccessType.PublicInviteOnly || leaderboard!.accessType === LeaderboardAccessType.Private) && (
                                    <Button as={UnstyledLink} to={`${match.url}/invites`} type="button">Manage Invites</Button>
                                )}

                                <Button negative isLoading={detailStore.isArchivingLeaderboard} action={() => detailStore.archiveLeaderboard()} confirmationMessage="Are you sure you want to archive this leaderboard?">Archive Leaderboard</Button>
                            </>
                        )}
                    </>
                )}

                {/* Leave button if member and not owner */}
                {leaderboard!.ownerId !== user?.osuUserId && detailStore.userMembership !== null && (
                    <Button type="button" negative isLoading={detailStore.isLeavingLeaderboard} action={handleLeave} confirmationMessage="Are you sure you want to leave this leaderboard?">Leave Leaderboard</Button>
                )}
            </VerticalButtonGroup>
            <EditLeaderboardModal open={editModalOpen} onClose={() => setEditModalOpen(false)} />
        </>
    );
});

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
    const { loadLeaderboard, loadingStatus, leaderboard } = detailStore;
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

    return (
        <>
            <Helmet>
                {loadingStatus === ResourceStatus.Loading && (
                    <title>Loading...</title>
                )}
                {loadingStatus === ResourceStatus.Loaded && leaderboard && (
                    <title>{leaderboard.name} - osu!chan</title>
                )}
                {loadingStatus === ResourceStatus.Error && (
                    <title>Leaderboard not found - osu!chan</title>
                )}
            </Helmet>

            {detailStore.loadingStatus === ResourceStatus.Loading && (
                <LoadingPage />
            )}
            {leaderboard && (
                <>
                    {/*Leaderboard Details */}
                    <LeaderboardSurface>
                        <LeaderboardDetailsContainer>
                            <LeaderboardInfoContainer>
                                {leaderboard.iconUrl && (
                                    <LeaderboardIcon src={leaderboard.iconUrl} />
                                )}
                                <LeaderboardInfo>
                                    <LeaderboardInfoRow>
                                        <LeaderboardName>{leaderboard.name}</LeaderboardName>
                                    </LeaderboardInfoRow>
                                    <LeaderboardInfoRow>
                                        {/* Labels */}
                                        <LabelGroup>
                                            {leaderboard.archived && (
                                                <Label negative>ARCHIVED</Label>
                                            )}
                                            <Label>{formatGamemodeName(leaderboard.gamemode)}</Label>
                                            <Label>
                                                {leaderboard.accessType === LeaderboardAccessType.Global && "Global"}
                                                {leaderboard.accessType === LeaderboardAccessType.Public && "Public"}
                                                {leaderboard.accessType === LeaderboardAccessType.PublicInviteOnly && "Invite-Only"}
                                                {leaderboard.accessType === LeaderboardAccessType.Private && "Private"}
                                            </Label>
                                            {leaderboard.scoreSet !== ScoreSet.Normal && (
                                                <Label special>
                                                    {leaderboard.scoreSet === ScoreSet.NeverChoke && "Never Choke"}
                                                    {leaderboard.scoreSet === ScoreSet.AlwaysFullCombo && "Always Full Combo"}
                                                </Label>
                                            )}
                                            {!leaderboard.allowPastScores && (
                                                <Label special>
                                                    Only scores after joining
                                                </Label>
                                            )}
                                        </LabelGroup>
                                    </LeaderboardInfoRow>
                                    {leaderboard.owner && (
                                        <LeaderboardInfoRow>
                                            Owned by <Owner>{leaderboard.owner.username}</Owner>
                                        </LeaderboardInfoRow>
                                    )}
                                </LeaderboardInfo>
                            </LeaderboardInfoContainer>
                            <Description>{leaderboard.description}</Description>
                        </LeaderboardDetailsContainer>
                        {leaderboard.scoreFilter && !scoreFilterIsDefault(leaderboard.scoreFilter) && (
                            <LeaderboardScoreFilterContainer>
                                <LeaderboardFilters gamemode={leaderboard.gamemode} scoreFilter={leaderboard.scoreFilter} />
                            </LeaderboardScoreFilterContainer>
                        )}
                        {leaderboard.accessType !== LeaderboardAccessType.Global && meStore.isAuthenticated && (
                            <LeaderboardButtonsContainer>
                                <LeaderboardButtons />
                            </LeaderboardButtonsContainer>
                        )}
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
