import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { NumberFormat, Tooltip } from "../../components";
import type { EventStats } from "../../store/models/events/types";
import { formatPlayTime } from "../../utils/formatting";

const Slide = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 0 2em 1em;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1em;
`;

const StatCard = styled.div`
    background-color: ${(props) => props.theme.colours.foreground};
    border-radius: 10px;
    padding: 1.2em;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 8em;
`;

const StatValue = styled.div`
    font-size: 2.4em;
    font-weight: 700;
`;

const StatLabel = styled.div`
    font-size: 0.8em;
    color: ${(props) => props.theme.colours.timber};
    margin-top: 0.4em;
`;

const InfoIcon = styled(FontAwesomeIcon)`
    color: ${(props) => props.theme.colours.timber};
    cursor: help;
`;

interface StatsSlideProps {
    stats: EventStats;
}

const StatsSlide = observer(({ stats }: StatsSlideProps) => (
    <Slide>
        <StatsGrid>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.totalScores} />
                </StatValue>
                <StatLabel>Scores</StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.totalPp} decimalPlaces={0} />
                </StatValue>
                <StatLabel>
                    Total PP{" "}
                    <Tooltip content="Sum of the pp of every submitted score, not weighted.">
                        <InfoIcon icon={faCircleInfo} />
                    </Tooltip>
                </StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.totalRegularHits} />
                </StatValue>
                <StatLabel>
                    Circles Clicked{" "}
                    <Tooltip content="+ fruits caught, drums hit, keys played.">
                        <InfoIcon icon={faCircleInfo} />
                    </Tooltip>
                </StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>{formatPlayTime(stats.totalPlayTime)}</StatValue>
                <StatLabel>Played</StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.uniqueCountries} />
                </StatValue>
                <StatLabel>Countries</StatLabel>
            </StatCard>
            <StatCard>
                <StatValue>
                    <NumberFormat value={stats.uniqueMaps} />
                </StatValue>
                <StatLabel>Unique Beatmaps Played</StatLabel>
            </StatCard>
        </StatsGrid>
    </Slide>
));

export default StatsSlide;
