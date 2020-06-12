import React, { useContext } from "react";
import ReactSelect, { StylesConfig } from "react-select";
import { ThemeContext } from "styled-components";

export const Select = <T extends OptionValue = number>(props: SelectProps<T>) => {
    const theme = useContext(ThemeContext);

    const styles: StylesConfig = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: state.isDisabled ? theme.colours.midground : theme.colours.background,
            border: "none"
        }),
        input: (provided, state) => ({
            ...provided,
            backgroundColor: theme.colours.background,
            color: "#fff"
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: "#fff"
        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: theme.colours.background
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected || state.isFocused ? theme.colours.background : "#fff",
            backgroundColor: state.isSelected || state.isFocused ? "#fff" : provided.backgroundColor
        })
    }
    
    const selectedOption = props.options.find(option => option.value === props.value);
    return (
        <ReactSelect
            options={props.options}
            value={selectedOption}
            onChange={option => props.onChange((option as Option<T>).value)}
            isDisabled={props.disabled}
            styles={styles}
        />
    )
}

type OptionValue = string | number;
type Option<T extends OptionValue> = {
    value: T;
    label: string;
}

interface SelectProps<T extends OptionValue> {
    options: Option<T>[];
    value: T | undefined;
    onChange: (value: T) => void;
    disabled?: boolean;
}
