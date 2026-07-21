import TimeAgoReact from "react-timeago";
import { Tooltip } from "./Tooltip";
import { useState, useEffect } from "react";

export const TimeAgo = (props: TimeAgoProps) => {
    const oneYear = 1000 * 60 * 60 * 24 * 365; // regular year in seconds
    const oneYearAgo = Date.now() - oneYear;
    const datetime = props.datetime.getTime();
    const content = props.datetime.toDateString();
    // if less than one year ago, use timeago-react, else just display "Month YEAR"
    return (
        <>
            {datetime < oneYearAgo ? (
                <Tooltip content={content}>
                    <time dateTime={datetime.toString()}>
                        {props.datetime.toLocaleString("default", {
                            month: "long",
                        })}{" "}
                        {props.datetime.getFullYear()}
                    </time>
                </Tooltip>
            ) : (
                <Tooltip content={content}>
                    <TimeAgoReact date={props.datetime} />
                </Tooltip>
            )}
        </>
    );
};

interface TimeAgoProps {
    datetime: Date;
}

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_WEEK = 604800;
const SECONDS_IN_YEAR = 31536000;

function timeAgoShort(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < SECONDS_IN_MINUTE) {
        return `${seconds}s`;
    } else if (seconds < SECONDS_IN_HOUR) {
        return `${Math.floor(seconds / SECONDS_IN_MINUTE)}m`;
    } else if (seconds < SECONDS_IN_DAY) {
        return `${Math.floor(seconds / SECONDS_IN_HOUR)}h`;
    } else if (seconds < SECONDS_IN_WEEK) {
        return `${Math.floor(seconds / SECONDS_IN_DAY)}d`;
    } else if (seconds < SECONDS_IN_YEAR) {
        return `${Math.floor(seconds / SECONDS_IN_WEEK)}w`;
    } else {
        return `${Math.floor(seconds / SECONDS_IN_YEAR)}y`;
    }
}

export const ShortTimeAgo = ({ date }: ShortTimeAgoProps) => {
    const [, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const parsedDate = typeof date === "string" ? new Date(date) : date;

    return <span>{timeAgoShort(parsedDate)}</span>;
};

interface ShortTimeAgoProps {
    date: Date | string;
}
