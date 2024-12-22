import { useContext } from "react";
import Select, { ValueType, StylesConfig } from "react-select";
import { Gamemode, ModAcronym } from "../../store/models/common/enums";
import { ThemeContext } from "styled-components";
import { ModsJson } from "../../store/models/profiles/types";
import { modAcronymsFromJsonMods } from "../../utils/osu";

// TODO: replace this ugly mess... custom select needed

type OptionType = { label: string; value: string };

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
        { value: ModAcronym.Hidden, label: ModAcronym.Hidden },
        { value: ModAcronym.DoubleTime, label: ModAcronym.DoubleTime },
        { value: ModAcronym.Nightcore, label: ModAcronym.Nightcore },
        { value: ModAcronym.Flashlight, label: ModAcronym.Flashlight },
        { value: ModAcronym.Easy, label: ModAcronym.Easy },
        { value: ModAcronym.HalfTime, label: ModAcronym.HalfTime },
        { value: ModAcronym.NoFail, label: ModAcronym.NoFail },
        { value: ModAcronym.SuddenDeath, label: ModAcronym.SuddenDeath },
        { value: ModAcronym.Perfect, label: ModAcronym.Perfect },
    ];

    if (props.gamemode === Gamemode.Standard) {
        selectModOptions.push(
            { value: ModAcronym.SpunOut, label: ModAcronym.SpunOut },
            { value: ModAcronym.TouchDevice, label: ModAcronym.TouchDevice }
        );
    }

    if (props.gamemode !== Gamemode.Mania) {
        selectModOptions.push({ value: ModAcronym.HardRock, label: ModAcronym.HardRock });
    }

    if (props.gamemode === Gamemode.Mania) {
        selectModOptions.push({ value: ModAcronym.FadeIn, label: ModAcronym.FadeIn });
    }

    const mods = modAcronymsFromJsonMods(props.value);

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
                    const modAcronyms = (value as OptionType[]).map(
                        (option) => option.value
                    );
                    const selectedMods = modAcronyms.reduce(
                        (jsonMods, modAcronym) => ({
                            ...jsonMods,
                            [modAcronym]: {},
                        }),
                        {}
                    );
                    props.onChange(selectedMods);
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
    value: ModsJson;
    onChange: (mods: ModsJson) => void;
}
