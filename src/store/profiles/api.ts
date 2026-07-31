import { useQueries, useQuery } from "@tanstack/react-query";
import http from "../../http";
import { beatmapFromJson } from "../models/profiles/deserialisers";
import type { Beatmap } from "../models/profiles/types";

export const profileKeys = {
    all: ["profiles"] as const,
    beatmap: (beatmapId: number) => [...profileKeys.all, "beatmap", beatmapId] as const,
};

function fetchBeatmap(beatmapId: number): Promise<Beatmap> {
    return http
        .get(`/api/profiles/beatmaps/${beatmapId}`)
        .then((response) => beatmapFromJson(response.data));
}

export function useBeatmap(beatmapId: number | null) {
    return useQuery({
        queryKey: profileKeys.beatmap(beatmapId ?? 0),
        queryFn: async (): Promise<Beatmap> => fetchBeatmap(beatmapId!),
        enabled: beatmapId !== null,
    });
}

export function useBeatmaps(beatmapIds: number[]) {
    return useQueries({
        queries: beatmapIds.map((beatmapId) => ({
            queryKey: profileKeys.beatmap(beatmapId),
            queryFn: (): Promise<Beatmap> => fetchBeatmap(beatmapId),
        })),
    });
}
