export enum ResourceStatus {
    NotLoaded = 0,
    Loading = 1 << 0,
    Loaded = 1 << 1,
    Error = 1 << 2
}

export enum PaginatedResourceStatus {
    NotLoaded = 0,
    LoadingInitial = 1 << 0,
    PartiallyLoaded = 1 << 1,
    LoadingMore = 1 << 2,
    Loaded = 1 << 3,
    Error = 1 << 4,

    Loading = LoadingInitial | LoadingMore,
    ContentAvailable = PartiallyLoaded | LoadingMore | Loaded,
    MoreToLoad = NotLoaded | Loading | PartiallyLoaded
}
