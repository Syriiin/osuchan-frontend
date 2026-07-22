import { observer } from "mobx-react-lite";
import styled from "styled-components";
import {
    Button,
    LoadingSection,
    Row,
    TimeAgo,
    Surface,
    SurfaceSubtitle,
    SurfaceTitle,
    UnstyledLink,
} from "../../components";
import { useMinigameHistory } from "../../store/minigames/api";
import { MinigameStatus } from "../../store/models/minigames/types";
import { formatGamemodeName, gamemodeIcon } from "../../utils/formatting";
import { formatGameType, statusLabel } from "./formatting";
import {
    IconLeft,
    GamemodeIcon,
    StatusBadge,
    SectionSpacer,
    EmptyState,
    MetaItem,
} from "./styledComponents";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const HistorySurface = styled(Surface)`
    margin: 20px auto;
    width: 1000px;
    padding: 20px;
`;

const HistoryIcon = styled.img`
    width: 86px;
    height: 86px;
    border-radius: 5px;
    object-fit: cover;
`;

const HistoryInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 10px;
    gap: 2px;
`;

const HistoryName = styled.span`
    font-size: 1.5em;
`;

const HistoryHost = styled.span`
    color: ${(props) => props.theme.colours.timber};
    font-size: 0.85em;
`;

const HistoryMetaRow = styled.div`
    display: flex;
    gap: 12px;
    font-size: 0.85em;
    margin-top: 2px;
`;

const MinigameHistory = observer(() => {
    const { data: history, isLoading } = useMinigameHistory();

    const current = (history ?? []).filter((m) => m.status !== MinigameStatus.Finished);
    const finished = (history ?? []).filter((m) => m.status === MinigameStatus.Finished);

    return (
        <>
            <title>Minigame History - osu!chan</title>
            <HistorySurface>
                <SurfaceTitle>Minigame History</SurfaceTitle>

                {isLoading && <LoadingSection />}

                {!isLoading && (!history || history.length === 0) && (
                    <EmptyState>No minigames played yet.</EmptyState>
                )}

                {current.length > 0 && (
                    <>
                        <SurfaceSubtitle>Current Games</SurfaceSubtitle>
                        {current.map((minigame) => (
                            <Row key={minigame.id}>
                                <HistoryIcon src={`https://a.ppy.sh/${minigame.host.id}`} />
                                <HistoryInfo>
                                    <HistoryName>{minigame.name}</HistoryName>
                                    <HistoryHost>Host: {minigame.host.username}</HistoryHost>
                                    <HistoryMetaRow>
                                        <MetaItem>
                                            <GamemodeIcon
                                                src={gamemodeIcon(minigame.gamemode)}
                                                alt=""
                                            />
                                            {formatGamemodeName(minigame.gamemode)}
                                        </MetaItem>
                                        <MetaItem>{formatGameType(minigame.gameType)}</MetaItem>
                                        <MetaItem>
                                            <StatusBadge $status={minigame.status}>
                                                {statusLabel(minigame.status)}
                                            </StatusBadge>
                                        </MetaItem>
                                    </HistoryMetaRow>
                                </HistoryInfo>
                                <Button as={UnstyledLink} to={`/minigames/${minigame.id}`}>
                                    <IconLeft icon={faEye} fixedWidth /> View
                                </Button>
                            </Row>
                        ))}
                    </>
                )}

                {finished.length > 0 && (
                    <>
                        {current.length > 0 && <SectionSpacer />}
                        <SurfaceSubtitle>Past Games</SurfaceSubtitle>
                        {finished.map((minigame) => (
                            <Row key={minigame.id}>
                                <HistoryIcon src={`https://a.ppy.sh/${minigame.host.id}`} />
                                <HistoryInfo>
                                    <HistoryName>{minigame.name}</HistoryName>
                                    <HistoryHost>Host: {minigame.host.username}</HistoryHost>
                                    <HistoryMetaRow>
                                        <MetaItem>
                                            <GamemodeIcon
                                                src={gamemodeIcon(minigame.gamemode)}
                                                alt=""
                                            />
                                            {formatGamemodeName(minigame.gamemode)}
                                        </MetaItem>
                                        <MetaItem>{formatGameType(minigame.gameType)}</MetaItem>
                                        <MetaItem>
                                            <StatusBadge $status={minigame.status}>
                                                {statusLabel(minigame.status)}
                                            </StatusBadge>
                                        </MetaItem>
                                        <MetaItem>
                                            <TimeAgo
                                                datetime={minigame.endTime ?? minigame.createdAt}
                                            />
                                        </MetaItem>
                                    </HistoryMetaRow>
                                </HistoryInfo>
                                <Button as={UnstyledLink} to={`/minigames/${minigame.id}`}>
                                    <IconLeft icon={faEye} fixedWidth /> View
                                </Button>
                            </Row>
                        ))}
                    </>
                )}
            </HistorySurface>
        </>
    );
});

export default MinigameHistory;
