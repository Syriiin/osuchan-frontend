import { useEffect, useState } from "react";
import styled from "styled-components";

const TimerWrapper = styled.div`
    text-align: center;
    font-size: 2em;
    font-family: "Courier New", Courier, monospace;
    font-weight: bold;
    padding: 10px;
    color: ${(props) => props.theme.colours.timber};
`;

const TimerLabel = styled.div`
    font-size: 0.4em;
    color: ${(props) => props.theme.colours.timber};
    font-family: "Exo 2", sans-serif;
`;

interface CountdownTimerProps {
    target: Date;
    label?: string;
    onExpired?: () => void;
}

function getRemaining(target: Date): number {
    return Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

const CountdownTimer = (props: CountdownTimerProps) => {
    const { target, label, onExpired } = props;
    const [remaining, setRemaining] = useState(() => getRemaining(target));

    useEffect(() => {
        setRemaining(getRemaining(target));
        const interval = setInterval(() => {
            const r = getRemaining(target);
            setRemaining(r);
            if (r === 0) {
                clearInterval(interval);
                onExpired?.();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [target, onExpired]);

    return (
        <TimerWrapper>
            {label !== undefined && <TimerLabel>{label}</TimerLabel>}
            {formatTime(remaining)}
        </TimerWrapper>
    );
};

export default CountdownTimer;
