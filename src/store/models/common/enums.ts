export enum Mods {
    None = 0,
    NoFail = 1,
    Easy = 2,
    TouchDevice = 4,
    Hidden = 8,
    HardRock = 16,
    SuddenDeath = 32,
    DoubleTime = 64,
    Relax = 128,
    HalfTime = 256,
    Nightcore = 512,
    Flashlight = 1024,
    Auto = 2048,
    SpunOut = 4096,
    Autopilot = 8192,
    Perfect = 16384,
    Key4 = 32768,
    Key5 = 65536,
    Key6 = 131072,
    Key7 = 262144,
    Key8 = 524288,
    FadeIn = 1048576,
    Random = 2097152,
    Cinema = 4194304,
    TargetPractice = 8388608,
    Key9 = 16777216,
    KeyCoop = 33554432,
    Key1 = 67108864,
    Key2 = 134217728,
    Key3 = 268435456,
    ScoreV2 = 536870912,
    Mirror = 1073741824,

    KeyMod = Key1 | Key2 | Key3 | Key4 | Key5 | Key6 | Key7 | Key8 | Key9 | KeyCoop,
    FreemodAllowed = NoFail | Easy | Hidden | HardRock | SuddenDeath | Flashlight | FadeIn | Relax | Autopilot | SpunOut | KeyMod,
    ScoreIncreasing = Hidden | HardRock | DoubleTime | Flashlight | Autopilot | FadeIn,

    SpeedChanging = DoubleTime | HalfTime | Nightcore,
    MapChanging = DoubleTime | HardRock | Easy,
    Unranked = Relax | Auto | Autopilot
}

export enum Gamemode {
    Standard = 0,
    Taiko = 1,
    Catch = 2,
    Mania = 3
}

export enum BeatmapStatus {
    Graveyard = -2,
    WorkInProgress = -1,
    Pending = 0,
    Ranked = 1,
    Approved = 2,
    Qualified = 3,
    Loved = 4
}
