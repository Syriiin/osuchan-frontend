import React from "react";
import TimeAgoReact, { TimeAgoProps as TimeAgoReactProps } from "timeago-react";

export const TimeAgo = (props: TimeAgoProps) => {
    const oneYear = 1000 * 60 * 60 * 24 * 365  // regular year in seconds
    const oneYearAgo = Date.now() - oneYear;
    const datetime = props.datetime.getTime();
    // if less than one year ago, use timeago-react, else just display "Month YEAR"
    return datetime < oneYearAgo ? (
        <time className={props.className} dateTime={datetime.toString()}>{props.datetime.toLocaleString("default", { month: "long" })} {props.datetime.getFullYear()}</time>
    ) : (
        <TimeAgoReact {...props} />
    );
};

interface TimeAgoProps extends TimeAgoReactProps {
    datetime: Date;
}
