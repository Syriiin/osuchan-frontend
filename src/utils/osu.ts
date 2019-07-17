export function gamemodeIdFromName(gamemodeName: string | undefined): number {
    switch (gamemodeName) {
        case "osu":
        default:
            return 0;
        case "taiko":
            return 1;
        case "catch":
        case "fruits":
            return 2;
        case "mania":
            return 3;
    }
}
