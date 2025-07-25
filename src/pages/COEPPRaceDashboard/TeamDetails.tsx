import styled from "styled-components";
import { PPRaceTeam } from "../../store/models/ppraces/types";
import { Score } from "../../store/models/profiles/types";
import { observer } from "mobx-react-lite";
import { NumberFormat } from "../../components";
import TeamPlayerDetails from "./TeamPlayerDetails";
import TeamScoreDetails from "./TeamScoreDetails";

const TeamDetailsWrapper = styled.div`
    display: grid;
    grid-template-rows: 100px 1fr;
    grid-template-areas:
        "header"
        "details";
    grid-gap: 5px;
    padding: 5px;
    width: 100%;
`;

const Header = styled.div<{ teamColour: string }>`
    grid-area: header;
    background-color: ${(props) => props.teamColour};
    border-radius: 5px;
    padding: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
`;

const TeamTitle = styled.div`
    font-size: 4em;
    font-weight: bold;
    margin-left: 0.2em;
`;

const TeamTotal = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 2em;
`;

const TeamPerformanceTotal = styled.div`
    font-size: 1.5em;
    font-weight: bold;
`;

const TeamScoreCount = styled.div`
    font-size: 0.5em;
    align-self: flex-end;
`;

const Details = styled.div`
    grid-area: details;
    overflow: hidden;
`;

const TeamDetails = observer((props: TeamDetailsProps) => {
    const team = props.team;
    const scores = props.scores;
    const players = team.players;

    return (
        <TeamDetailsWrapper>
            <Header teamColour={props.teamColour}>
                <TeamTitle>{team.name}</TeamTitle>
                <TeamTotal>
                    <TeamPerformanceTotal>
                        <NumberFormat value={team.totalPp} decimalPlaces={0} />
                        pp
                    </TeamPerformanceTotal>
                    <TeamScoreCount>
                        {team.scoreCount} scores in total
                    </TeamScoreCount>
                </TeamTotal>
            </Header>
            <Details>
                {props.mode === "players" && (
                    <TeamPlayerDetails
                        teamColour={props.teamColour}
                        players={players}
                    />
                )}
                {props.mode === "scores" && (
                    <TeamScoreDetails
                        teamColour={props.teamColour}
                        topScores={scores}
                        scoresCount={team.scoreCount}
                        teamPpTotal={team.totalPp}
                        ppDecayBase={props.ppDecayBase}
                    />
                )}
            </Details>
        </TeamDetailsWrapper>
    );
});

interface TeamDetailsProps {
    team: PPRaceTeam;
    scores: Score[];
    teamColour: string;
    mode: "players" | "scores";
    ppDecayBase: number;
}

export default TeamDetails;
