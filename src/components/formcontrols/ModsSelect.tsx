import React from "react";
import Select, { ValueType, StylesConfig } from "react-select";

// TODO: replace this ugly mess... custom select needed

type OptionType = { label: string; value: number; }

const styles: StylesConfig = {
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: "#17171c"
    }),
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#17171c"
    }),
    input: (provided, state) => ({
        ...provided,
        backgroundColor: "#17171c"
    }),
    option: (provided, state) => {
        return ({
            ...provided,
            color: state.isFocused ? "#17171c" : "white"
        });
    },
}

export function ModsSelect(props: ModsSelectProps) {
    const selectModOptions = [
        { value: 8, label: "HD" },
        { value: 64, label: "DT" },
        { value: 512, label: "NC" },
        { value: 1024, label: "FL" },
        { value: 2, label: "EZ" },
        { value: 256, label: "HT" },
        { value: 1, label: "NF" },
        { value: 32, label: "SD" },
        { value: 16384, label: "PF" }
    ];

    if (props.gamemode === 0) {
        selectModOptions.push(
            { value: 4096, label: "SO" },
            { value: 4, label: "TD" }
        );
    }

    if (props.gamemode !== 3) {
        selectModOptions.push({ value: 16, label: "HR" });
    }

    if (props.gamemode === 3) {
        selectModOptions.push({ value: 1048576, label: "FI" });
    }

    // convert bit mods to mods array
    const mods = []
    for (const option of selectModOptions) {
        if (props.value & option.value) {
            mods.push(option.value);
        }
    }

    return (
        <Select
            value={mods.map(value => selectModOptions.find(option => option.value === value) as OptionType)}
            isMulti
            onChange={(value: ValueType<OptionType>) => {
                if (value) {
                    props.onChange((value as OptionType[]).map(option => option.value).reduce((total, value) => total | value, 0));
                }
            }}
            options={selectModOptions}
            styles={styles}
        />
    );
}

interface ModsSelectProps {
    gamemode: number;
    value: number;
    onChange: (mods: number) => void;
}
