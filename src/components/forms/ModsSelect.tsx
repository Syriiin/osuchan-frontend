import { useContext } from "react";
import Select, { ValueType, StylesConfig } from "react-select";
import { Mods, Gamemode } from "../../store/models/common/enums";
import { ThemeContext } from "styled-components";

// TODO: replace this ugly mess... custom select needed

type OptionType = { label: string; value: Mods };

export const ModsSelect = (props: ModsSelectProps) => {
    const theme = useContext(ThemeContext);

    const styles: StylesConfig<OptionType, true> = {
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: theme.colours.background,
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: theme.colours.background,
            border: "none",
        }),
        input: (provided, state) => ({
            ...provided,
            backgroundColor: theme.colours.background,
            color: "#fff",
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isFocused ? theme.colours.background : "#fff",
        }),
    };

    const selectModOptions = [
        { value: 8, label: "HD" },
        { value: 64, label: "DT" },
        { value: 512, label: "NC" },
        { value: 1024, label: "FL" },
        { value: 2, label: "EZ" },
        { value: 256, label: "HT" },
        { value: 1, label: "NF" },
        { value: 32, label: "SD" },
        { value: 16384, label: "PF" },
    ];

    if (props.gamemode === Gamemode.Standard) {
        selectModOptions.push(
            { value: 4096, label: "SO" },
            { value: 4, label: "TD" }
        );
    }

    if (props.gamemode !== Gamemode.Mania) {
        selectModOptions.push({ value: 16, label: "HR" });
    }

    if (props.gamemode === Gamemode.Mania) {
        selectModOptions.push({ value: 1048576, label: "FI" });
    }

    // convert bit mods to mods array
    const mods = [];
    for (const option of selectModOptions) {
        if (props.value & option.value) {
            mods.push(option.value);
        }
    }

    return (
        <Select
            value={mods.map(
                (value) =>
                    selectModOptions.find(
                        (option) => option.value === value
                    ) as OptionType
            )}
            isMulti
            onChange={(value: ValueType<OptionType, true>) => {
                if (value) {
                    props.onChange(
                        (value as OptionType[])
                            .map((option) => option.value)
                            .reduce((total, value) => total | value, 0)
                    );
                }
            }}
            options={selectModOptions}
            styles={styles}
            isSearchable={false}
        />
    );
};

interface ModsSelectProps {
    gamemode: Gamemode;
    value: Mods;
    onChange: (mods: Mods) => void;
}
