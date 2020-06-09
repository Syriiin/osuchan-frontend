import React from "react";
import ReactSwitch, { ReactSwitchProps } from "react-switch";

export const Switch = (props: SwitchProps) => {
    return (
        <ReactSwitch
            {...props}
            uncheckedIcon={false}
            checkedIcon={false}
            height={props.mini ? 20 : 30}
            width={props.mini ? 45 : 58}
        />
    )
}

interface SwitchProps extends ReactSwitchProps {
    mini?: boolean;
}
