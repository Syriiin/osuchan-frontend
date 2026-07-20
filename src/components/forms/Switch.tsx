import ReactSwitch, { type ReactSwitchProps } from "react-switch";
import { useTheme } from "styled-components";

export const Switch = (props: SwitchProps) => {
    const theme = useTheme();
    const { mini, ...rest } = props;

    return (
        <ReactSwitch
            {...rest}
            uncheckedIcon={false}
            checkedIcon={false}
            height={mini ? 20 : 30}
            width={mini ? 45 : 58}
            offColor={theme.colours.currant}
            onColor={theme.colours.mystic}
        />
    );
};

interface SwitchProps extends ReactSwitchProps {
    mini?: boolean;
}
