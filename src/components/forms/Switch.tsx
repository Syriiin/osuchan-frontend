import { useContext } from "react";
import ReactSwitch, { ReactSwitchProps } from "react-switch";
import { ThemeContext } from "styled-components";

export const Switch = (props: SwitchProps) => {
    const theme = useContext(ThemeContext);
    
    return (
        <ReactSwitch
            {...props}
            uncheckedIcon={false}
            checkedIcon={false}
            height={props.mini ? 20 : 30}
            width={props.mini ? 45 : 58}
            offColor={theme.colours.currant}
            onColor={theme.colours.mystic}
        />
    );
}

interface SwitchProps extends ReactSwitchProps {
    mini?: boolean;
}
