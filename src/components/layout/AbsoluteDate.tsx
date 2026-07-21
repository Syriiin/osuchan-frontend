import { Tooltip } from "./Tooltip";

export const AbsoluteDate = (props: AbsoluteDateProps) => (
    <Tooltip content={props.date.toLocaleString()}>
        <span>{props.date.toLocaleDateString()}</span>
    </Tooltip>
);

interface AbsoluteDateProps {
    date: Date;
}
