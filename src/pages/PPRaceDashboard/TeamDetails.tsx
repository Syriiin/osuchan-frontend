import styled from "styled-components";
import { PPRaceTeam } from "../../store/models/ppraces/types";
import { Score } from "../../store/models/profiles/types";
import { observer } from "mobx-react-lite";
import { NumberFormat } from "../../components";
import TeamPlayerDetails from "./TeamPlayerDetails";
import TeamScoreDetails from "./TeamScoreDetails";

const TeamDetailsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    width: 100%;
`;

const TeamTitle = styled.div<{ teamColour: string }>`
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
    background-color: ${(props) => props.teamColour};
    border-radius: 5px;
    padding: 10px;
`;

const TeamTotal = styled.div<{ teamColour: string }>`
    text-align: center;
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 1em;
    background-color: ${(props) => props.teamColour};
    border-radius: 5px;
    padding: 10px;
`;

const TeamDetails = observer((props: TeamDetailsProps) => {
    const team = props.team;
    const scores = props.scores;
    const players = team.players;

    return (
        <TeamDetailsWrapper>
            <TeamTitle teamColour={props.teamColour}>{team.name}</TeamTitle>
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
            <TeamTotal teamColour={props.teamColour}>
                <NumberFormat value={team.totalPp} decimalPlaces={0} />
                pp
            </TeamTotal>
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
