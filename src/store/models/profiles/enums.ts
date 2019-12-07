export enum ScoreResult {
    Perfect = 1,
    NoBreak = 2,
    SliderBreak = 4,
    OneMiss = 8,
    EndChoke = 16,
    Clear = 32,

    FullCombo = Perfect | NoBreak,
    Choke = SliderBreak | OneMiss | EndChoke
}
