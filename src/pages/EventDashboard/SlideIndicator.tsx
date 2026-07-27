import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6em;
    padding: 0.5em 0;
    flex-shrink: 0;
`;

const Dot = styled.button<{ $active: boolean }>`
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: none;
    padding: 0;
    background-color: ${(props) =>
        props.$active ? props.theme.colours.mango : props.theme.colours.midground};
    transition: background-color 0.3s ease;
    cursor: pointer;
`;

interface SlideIndicatorProps {
    total: number;
    current: number;
    onSelect: (index: number) => void;
}

const SlideIndicator = ({ total: _total, current, onSelect }: SlideIndicatorProps) => (
    <Wrapper>
        {Array.from({ length: _total }, (_, i) => (
            <Dot key={i} $active={i === current} onClick={() => onSelect(i)} />
        ))}
    </Wrapper>
);

export default SlideIndicator;
