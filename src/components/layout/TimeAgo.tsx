import React from "react";
import TimeAgoReact, { TimeAgoProps as TimeAgoReactProps } from "timeago-react";
import { Tooltip } from "./Tooltip";

export const TimeAgo = (props: TimeAgoProps) => {
    const oneYear = 1000 * 60 * 60 * 24 * 365  // regular year in seconds
    const oneYearAgo = Date.now() - oneYear;
    const datetime = props.datetime.getTime();
    // if less than one year ago, use timeago-react, else just display "Month YEAR"
    return (
        <>
            {datetime < oneYearAgo ? (
                <time data-for={`timeago-${datetime}`} data-tip={props.datetime.toDateString()} className={props.className} dateTime={datetime.toString()}>{props.datetime.toLocaleString("default", { month: "long" })} {props.datetime.getFullYear()}</time>
            ) : (
                <TimeAgoReact data-for={`timeago-${datetime}`} data-tip={props.datetime.toDateString()} {...props} />
            )}
            <Tooltip id={`timeago-${datetime}`} />
        </>
    );
};

interface TimeAgoProps extends TimeAgoReactProps {
    datetime: Date;
}
