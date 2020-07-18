import React from "react";
import { Tooltip } from "./Tooltip";

export const NumberFormat = (props: NumberFormatProps) => {
    const id = `numberformat-${props.value}`;

    return (
        <>
            <span data-tip={props.value.toLocaleString("en", { maximumFractionDigits: props.tooltipDecimalPlaces ?? 3 })} data-for={id}>{props.value.toLocaleString("en", { maximumFractionDigits: props.decimalPlaces ?? 0 })}</span>
            <Tooltip id={id} />
        </>
    );
}

interface NumberFormatProps {
    value: number;
    decimalPlaces?: number;
    tooltipDecimalPlaces?: number;
}
