import { useState, useEffect } from "react";

const Countdown = (props: CountdownProps) => {
    const endTime = props.endTime;

    const [remainingTime, setRemainingTime] = useState(
        (endTime?.getTime() ?? Date.now()) - Date.now()
    );
    useEffect(() => {
        const interval = setInterval(() => {
            // Force re-render every second to update the countdown
            setRemainingTime((endTime?.getTime() ?? Date.now()) - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    if (!endTime) {
        return <span>Waiting</span>;
    }

    if (remainingTime <= 0) {
        return <span>00:00:00</span>;
    }

    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const hours = Math.floor(remainingTime / HOUR);
    const minutes = Math.floor((remainingTime % HOUR) / MINUTE);
    const seconds = Math.floor((remainingTime % MINUTE) / SECOND);

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
}

export default Countdown;
