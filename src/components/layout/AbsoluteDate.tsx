import { Tooltip } from "./Tooltip";

export const AbsoluteDate = (props: AbsoluteDateProps) => {
    const id = `absolutedate-${props.date.getTime()}`;

    return (
        <>
            <span
                data-tip={props.date.toLocaleString()}
                data-for={id}
            >
                {props.date.toLocaleDateString()}
            </span>
            <Tooltip id={id} />
        </>
    );
};

interface AbsoluteDateProps {
    date: Date;
}
