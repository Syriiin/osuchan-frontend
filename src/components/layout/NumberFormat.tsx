import { Tooltip } from "./Tooltip";

export const NumberFormat = (props: NumberFormatProps) => (
    <Tooltip
        content={props.value.toLocaleString("en", {
            maximumFractionDigits: props.tooltipDecimalPlaces ?? 3,
        })}
    >
        <span>
            {props.value.toLocaleString("en", {
                maximumFractionDigits: props.decimalPlaces ?? 0,
            })}
        </span>
    </Tooltip>
);

interface NumberFormatProps {
    value: number;
    decimalPlaces?: number;
    tooltipDecimalPlaces?: number;
}
