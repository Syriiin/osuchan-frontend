import ReactSwitch, { type ReactSwitchProps } from "react-switch";

export const Switch = (props: SwitchProps) => {
    const { mini, ...rest } = props;

    return (
        <ReactSwitch
            {...rest}
            uncheckedIcon={false}
            checkedIcon={false}
            height={mini ? 20 : 30}
            width={mini ? 45 : 58}
            offColor="#574566"
            onColor="#A02EFF"
        />
    );
};

interface SwitchProps extends ReactSwitchProps {
    mini?: boolean;
}
