import countries from "i18n-iso-countries";
import styled from "styled-components";
import { Tooltip } from "./Tooltip";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

const FlagWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FlagImage = styled.img`
    width: 2em;
`;

const CountryName = styled.span`
    margin-left: 0.5em;
`;

export const Flag = (props: FlagProps) => {
    const name = countries.getName(props.countryCode, "en");

    return (
        <FlagWrapper>
            <FlagImage
                data-tip={name}
                data-for={`country-${props.countryCode}`}
                src={`https://osu.ppy.sh/images/flags/${props.countryCode}.png`}
            />
            {props.showFullName && <CountryName>{name}</CountryName>}
            <Tooltip id={`country-${props.countryCode}`} />
        </FlagWrapper>
    );
};

interface FlagProps {
    countryCode: string;
    showFullName?: boolean;
}
