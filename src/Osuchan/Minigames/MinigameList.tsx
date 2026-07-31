import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import {
    faArrowRightToBracket,
    faClockRotateLeft,
    faEye,
    faPlus,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
    Button,
    Label,
    LoadingSection,
    Row,
    Surface,
    SurfaceHeaderContainer,
    SurfaceSubtitle,
    SurfaceTitle,
    UnstyledLink,
} from "../../components";
import { useMinigameList, useJoinMinigame } from "../../store/minigames/api";
import { MinigameStatus } from "../../store/models/minigames/types";
import type { Minigame } from "../../store/models/minigames/types";
import { formatGamemodeName, gamemodeIcon } from "../../utils/formatting";
import { useStore } from "../../utils/hooks";
import { useCurrentGame } from "./CurrentGameContext";
import CreateLobbyModal from "./CreateLobbyModal";
import { formatGameType, statusLabel } from "./formatting";
import {
    GamemodeIcon,
    MetaIcon,
    MetaItem,
    StatusBadge,
    SectionSpacer,
    EmptyState,
    IconLeft,
} from "./styledComponents";

const MinigamesSurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const BetaBadge = styled(Label)`
    margin-left: 12px;
    align-self: center;
    font-size: 15px;
    font-weight: 700;
    padding: 6px 14px;
    background-color: ${(props) => props.theme.colours.negative};
    color: #fff;
    white-space: nowrap;
`;

const LobbyIcon = styled.img`
    width: 86px;
    height: 86px;
    border-radius: 5px;
    object-fit: cover;
`;

const LobbyInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 10px;
    gap: 2px;
`;

const LobbyName = styled.span`
    font-size: 1.5em;
`;

const LobbyHost = styled.span`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.85em;
`;

const LobbyMetaRow = styled.div`
    display: flex;
    gap: 12px;
    font-size: 0.85em;
    margin-top: 2px;
`;

const MAX_VISIBLE_AVATARS = 5;

const PlayerAvatarStack = styled.div`
    display: flex;
    align-items: center;
`;

const PlayerAvatarWrapper = styled.div<{ $index: number }>`
    width: 28px;
    height: 28px;
    margin-left: ${(props) => (props.$index === 0 ? "0" : "-8px")};
`;

const PlayerAvatar = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colours.midground};
`;

const ExtraCount = styled.span`
    margin-left: 4px;
    font-size: 0.85em;
    color: ${(props) => props.theme.colours.timber};
    white-space: nowrap;
`;

const LobbyActions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 6px;
    margin-left: 10px;
    align-self: stretch;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 6px;
`;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CurrentGameBanner = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    width: 1000px;
    margin: 20px auto 0;
    border-radius: 6px;
    background-color: ${(props) => props.theme.colours.midground};
    border: 1px solid ${(props) => props.theme.colours.mystic}88;
    box-sizing: border-box;
    box-shadow: inset 3px 0 0 ${(props) => props.theme.colours.mystic};
`;

const CurrentGameLabel = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const CurrentGameSub = styled.span`
    font-size: 0.85em;
    color: gray;
`;

interface LobbyRowProps {
    minigame: Minigame;
    isInGame: boolean;
}

const LobbyRow = (props: LobbyRowProps) => {
    const { minigame, isInGame } = props;
    const navigate = useNavigate();
    const store = useStore();
    const joinMutation = useJoinMinigame();
    const totalPlayers = minigame.teams.reduce((sum, t) => sum + t.players.length, 0);
    const isJoinable =
        (minigame.status === MinigameStatus.Lobby ||
            minigame.status === MinigameStatus.WaitingToStart) &&
        !isInGame;

    const handleJoin = () => {
        joinMutation.mutate(minigame.id, {
            onSuccess: () => navigate(`/minigames/${minigame.id}`),
        });
    };

    return (
        <Row>
            <LobbyIcon src={`https://a.ppy.sh/${minigame.host.id}`} />
            <LobbyInfo>
                <LobbyName>{minigame.name}</LobbyName>
                <LobbyHost>Host: {minigame.host.username}</LobbyHost>
                <LobbyMetaRow>
                    <MetaItem>
                        <GamemodeIcon src={gamemodeIcon(minigame.gamemode)} alt="" />
                        {formatGamemodeName(minigame.gamemode)}
                    </MetaItem>
                    <MetaItem>{formatGameType(minigame.gameType)}</MetaItem>
                    <MetaItem>
                        <MetaIcon icon={minigame.isFreeForAll ? faUser : faUsers} />
                        {minigame.isFreeForAll ? "Free for All" : "Teams"}
                    </MetaItem>
                    <MetaItem>
                        <PlayerAvatarStack>
                            {minigame.teams
                                .flatMap((t) => t.players)
                                .slice(0, MAX_VISIBLE_AVATARS)
                                .map((player, index) => (
                                    <PlayerAvatarWrapper key={player.id} $index={index}>
                                        <PlayerAvatar
                                            src={`https://a.ppy.sh/${player.user.id}`}
                                            alt={player.user.username}
                                        />
                                    </PlayerAvatarWrapper>
                                ))}
                            {totalPlayers > MAX_VISIBLE_AVATARS && (
                                <ExtraCount>+{totalPlayers - MAX_VISIBLE_AVATARS}</ExtraCount>
                            )}
                            {totalPlayers === 0 && <ExtraCount>No players</ExtraCount>}
                        </PlayerAvatarStack>
                    </MetaItem>
                </LobbyMetaRow>
            </LobbyInfo>
            <LobbyActions>
                {minigame.status === MinigameStatus.WaitingToStart && (
                    <StatusBadge $status={minigame.status}>
                        {statusLabel(minigame.status)}
                    </StatusBadge>
                )}
                <ButtonRow>
                    <UnstyledLink to={`/minigames/${minigame.id}`}>
                        <Button>
                            <IconLeft icon={faEye} fixedWidth /> Spectate
                        </Button>
                    </UnstyledLink>
                    {isJoinable && store.meStore.isAuthenticated ? (
                        <div onClick={(e) => e.stopPropagation()}>
                            <Button
                                isLoading={
                                    joinMutation.isPending && joinMutation.variables === minigame.id
                                }
                                action={handleJoin}
                            >
                                <IconLeft icon={faArrowRightToBracket} fixedWidth /> Join
                            </Button>
                        </div>
                    ) : isJoinable && !store.meStore.isAuthenticated ? (
                        <Button as={UnstyledLink} to="/osuauth/login">
                            <IconLeft icon={faArrowRightToBracket} fixedWidth /> Login to join
                        </Button>
                    ) : null}
                </ButtonRow>
            </LobbyActions>
        </Row>
    );
};

const MinigameList = observer(() => {
    const store = useStore();
    const meStore = store.meStore;

    const activeStatuses = [
        MinigameStatus.Lobby,
        MinigameStatus.WaitingToStart,
        MinigameStatus.InProgress,
        MinigameStatus.Finalising,
    ];

    const { data: minigames, isLoading } = useMinigameList(activeStatuses);
    const currentGame = useCurrentGame();

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const joinable = (minigames ?? []).filter(
        (m) => m.status === MinigameStatus.Lobby || m.status === MinigameStatus.WaitingToStart,
    );
    const active = (minigames ?? []).filter(
        (m) => m.status === MinigameStatus.InProgress || m.status === MinigameStatus.Finalising,
    );
    const hasAny = joinable.length > 0 || active.length > 0;

    const isInGame = currentGame !== null;

    return (
        <>
            <title>Minigames - osu!chan</title>
            <PageWrapper>
                {currentGame !== null && (
                    <CurrentGameBanner>
                        <CurrentGameLabel>
                            <span>You are currently in a lobby</span>
                            <CurrentGameSub>
                                {currentGame.name} — {statusLabel(currentGame.status)}
                            </CurrentGameSub>
                        </CurrentGameLabel>
                        <Button as={UnstyledLink} to={`/minigames/${currentGame.id}`}>
                            <IconLeft icon={faEye} fixedWidth /> Go to lobby
                        </Button>
                    </CurrentGameBanner>
                )}
                <MinigamesSurface>
                    <SurfaceHeaderContainer>
                        <SurfaceTitle>
                            Minigames
                            <BetaBadge>Closed beta for COE 2026</BetaBadge>
                        </SurfaceTitle>
                        {meStore.isAuthenticated ? (
                            <Button action={() => setCreateModalOpen(true)}>
                                <IconLeft icon={faPlus} fixedWidth /> Create Lobby
                            </Button>
                        ) : (
                            <Button as={UnstyledLink} to="/osuauth/login">
                                <IconLeft icon={faPlus} fixedWidth /> Login to create a lobby
                            </Button>
                        )}
                        <Button as={UnstyledLink} to="/minigames/history">
                            <IconLeft icon={faClockRotateLeft} fixedWidth /> History
                        </Button>
                    </SurfaceHeaderContainer>

                    {isLoading && <LoadingSection />}

                    {!isLoading && !hasAny && (
                        <EmptyState>
                            No lobbies currently open. Create one to get started!
                        </EmptyState>
                    )}

                    {joinable.length > 0 && (
                        <>
                            <SurfaceSubtitle>Open Lobbies</SurfaceSubtitle>
                            {joinable.map((minigame) => (
                                <LobbyRow
                                    key={minigame.id}
                                    minigame={minigame}
                                    isInGame={isInGame}
                                />
                            ))}
                        </>
                    )}

                    {active.length > 0 && (
                        <>
                            {joinable.length > 0 && <SectionSpacer />}
                            <SurfaceSubtitle>Games In Progress</SurfaceSubtitle>
                            {active.map((minigame) => (
                                <LobbyRow
                                    key={minigame.id}
                                    minigame={minigame}
                                    isInGame={isInGame}
                                />
                            ))}
                        </>
                    )}
                </MinigamesSurface>
            </PageWrapper>

            <CreateLobbyModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
        </>
    );
});

export default MinigameList;
