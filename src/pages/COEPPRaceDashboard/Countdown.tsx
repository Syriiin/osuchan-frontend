import { useState, useEffect } from "react";
import { PPRaceStatus } from "../../store/models/ppraces/enums";
import styled from "styled-components";

const Finalising = styled.span`
    font-size: 0.6em;
`;

const Countdown = (props: CountdownProps) => {
    const endTime = props.endTime;
    const startTime = props.startTime;
    const status = props.status;

    const [currentTime, setCurrentTime] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => {
            // Force re-render every second to update the countdown
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (status === PPRaceStatus.Lobby) {
        return <span>Lobby</span>;
    }

    if (
        status === PPRaceStatus.Finalising ||
        (status === PPRaceStatus.InProgress && currentTime > endTime!.getTime())
    ) {
        return <Finalising>Finalising...</Finalising>;
    }

    if (status === PPRaceStatus.Finished) {
        return <span>00:00:00</span>;
    }

    let timeRemaining = 0;

    if (status === PPRaceStatus.InProgress) {
        timeRemaining = endTime!.getTime() - currentTime;
    }
    if (status === PPRaceStatus.WaitingToStart) {
        if (currentTime < startTime!.getTime()) {
            timeRemaining = startTime!.getTime() - currentTime;
        } else {
            timeRemaining = endTime!.getTime() - currentTime;
        }
    }

    if (timeRemaining <= 0) {
        return <span>00:00:00</span>;
    }

    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const hours = Math.floor(timeRemaining / HOUR);
    const minutes = Math.floor((timeRemaining % HOUR) / MINUTE);
    const seconds = Math.floor((timeRemaining % MINUTE) / SECOND);

    return (
        <span>
            {hours < 10 ? "0" : ""}
            {hours}:{minutes < 10 ? "0" : ""}
            {minutes}:{seconds < 10 ? "0" : ""}
            {seconds}
        </span>
    );
};

interface CountdownProps {
    endTime?: Date;
    startTime?: Date;
    status: PPRaceStatus;
}

export default Countdown;
