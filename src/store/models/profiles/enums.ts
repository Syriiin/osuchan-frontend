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

export enum ScoreSet {
    Normal = 0,
    NeverChoke = 1,
    AlwaysFullCombo = 2
}

export enum AllowedBeatmapStatus {
    Any = 0,
    RankedOnly = 1, // ranked + approved
    LovedOnly = 2
}
