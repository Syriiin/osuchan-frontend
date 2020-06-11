import React from "react";
import ReactSelect, { StylesConfig } from "react-select";

const styles: StylesConfig = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: state.isDisabled ? "#29293D" : "#17171C"
    }),
    input: (provided, state) => ({
        ...provided,
        backgroundColor: "#17171C",
        color: "white"
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: "white"
    }),
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: "#17171C"
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected || state.isFocused ? "#17171C" : "white",
        backgroundColor: state.isSelected || state.isFocused ? "white" : provided.backgroundColor
    })
}

export const Select = <T extends OptionValue = number>(props: SelectProps<T>) => {
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
