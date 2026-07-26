import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import http from "../../http";
import notify from "../../notifications";
import { minigameFromJson, minigameScoringScoreFromJson } from "../models/minigames/deserialisers";
import { MinigameStatus } from "../models/minigames/types";
import type { Minigame } from "../models/minigames/types";
import { scoreFromJson } from "../models/profiles/deserialisers";

export const minigameKeys = {
    all: ["minigames"] as const,
    list: () => [...minigameKeys.all, "list"] as const,
    history: () => [...minigameKeys.all, "history"] as const,
    detail: (id: number) => [...minigameKeys.all, "detail", id] as const,
    scores: (id: number) => [...minigameKeys.detail(id), "scores"] as const,
    scoringScores: (id: number) => [...minigameKeys.detail(id), "scoring-scores"] as const,
};

export function useMinigameList(statuses?: string[]) {
    const params = statuses ? `?statuses=${statuses.join(",")}` : "";
    return useQuery({
        queryKey: [...minigameKeys.list(), statuses],
        queryFn: async () => {
            const response = await http.get(`/api/minigames/${params}`);
            return (response.data as any[]).map(minigameFromJson);
        },
        refetchInterval: 60_000,
    });
}

export function useMinigameHistory() {
    return useQuery({
        queryKey: minigameKeys.history(),
        queryFn: async () => {
            const response = await http.get("/api/minigames/history");
            return (response.data as any[]).map(minigameFromJson);
        },
        refetchInterval: 30_000,
    });
}

function minigameRefetchInterval(query: { state: { data: Minigame | undefined } }): number | false {
    const data = query.state.data as Minigame | undefined;
    if (data === undefined) return false;
    if (data.status === MinigameStatus.Lobby) return 5_000;
    if (data.status === MinigameStatus.WaitingToStart) return 5_000;
    if (data.status === MinigameStatus.InProgress) return 1_0000;
    if (data.status === MinigameStatus.Finalising) return 5_000;
    return false;
}

export function useMinigame(id: number) {
    return useQuery({
        queryKey: minigameKeys.detail(id),
        queryFn: async () => {
            const response = await http.get(`/api/minigames/${id}`);
            return minigameFromJson(response.data);
        },
        refetchInterval: minigameRefetchInterval,
    });
}

function scoresRefetchInterval(status: MinigameStatus | null): number | false {
    if (status === null) return false;
    if (status === MinigameStatus.InProgress) return 10_000;
    if (status === MinigameStatus.Finalising) return 5_000;
    return false;
}

export function useMinigameRecentScores(id: number, status: MinigameStatus | null) {
    const canFetch = status !== null && status !== MinigameStatus.Lobby;
    return useQuery({
        queryKey: minigameKeys.scores(id),
        queryFn: async () => {
            const response = await http.get(`/api/minigames/${id}/recent-scores`);
            return (response.data as any[]).map((score) => scoreFromJson(score));
        },
        enabled: canFetch,
        refetchInterval: canFetch ? scoresRefetchInterval(status) : false,
    });
}

export function useMinigameScoringScores(id: number, status: MinigameStatus | null) {
    const canFetch = status !== null && status !== MinigameStatus.Lobby;
    return useQuery({
        queryKey: minigameKeys.scoringScores(id),
        queryFn: async () => {
            const response = await http.get(`/api/minigames/${id}/scoring-scores`);
            return (response.data as any[]).map(minigameScoringScoreFromJson);
        },
        enabled: canFetch,
        refetchInterval: canFetch ? scoresRefetchInterval(status) : false,
    });
}

type CreateMinigameInput = {
    gameType: string;
    name: string;
    gamemode: number;
    isFreeForAll: boolean;
    teams: string[];
    settings: Record<string, unknown>;
};

type StartMinigameInput = {
    id: number;
    countdown?: number;
};

type UpdateSettingsInput = {
    id: number;
    settings: Record<string, unknown>;
};

type MoveTeamInput = {
    id: number;
    teamId: number;
};

export function useCreateMinigame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateMinigameInput) => {
            const response = await http.post("/api/minigames/", {
                game_type: input.gameType,
                name: input.name,
                gamemode: input.gamemode,
                is_free_for_all: input.isFreeForAll,
                teams: input.teams,
                settings: input.settings,
            });
            return minigameFromJson(response.data);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: minigameKeys.list(),
            });
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            const detail = error.response?.data?.detail;
            if (error.response?.status === 403) {
                notify.negative("Minigames are currently in closed beta.");
            } else {
                notify.negative(detail ?? "Failed to create minigame.");
            }
        },
    });
}

export function useJoinMinigame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await http.post(`/api/minigames/${id}/join`);
        },
        onSuccess: (_data, id) => {
            void queryClient.invalidateQueries({
                queryKey: minigameKeys.detail(id),
            });
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            const detail = error.response?.data?.detail;
            if (error.response?.status === 403) {
                notify.negative("Minigames are currently in closed beta.");
            } else {
                notify.negative(detail ?? "Failed to join minigame.");
            }
        },
    });
}

export function useLeaveMinigame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await http.post(`/api/minigames/${id}/leave`);
        },
        onSuccess: (_data, id) => {
            void queryClient.invalidateQueries({
                queryKey: minigameKeys.detail(id),
            });
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            notify.negative(error?.response?.data?.detail ?? "Failed to leave minigame.");
        },
    });
}

export function useStartMinigame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: StartMinigameInput) => {
            const { id, countdown } = input;
            await http.post(`/api/minigames/${id}/start`, { countdown });
        },
        onSuccess: (_data, { id }) => {
            void queryClient.invalidateQueries({
                queryKey: minigameKeys.detail(id),
            });
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            notify.negative(error?.response?.data?.detail ?? "Failed to start minigame.");
        },
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateSettingsInput) => {
            const { id, ...body } = input;
            await http.patch(`/api/minigames/${id}/settings`, body);
        },
        onSuccess: (_data, { id }) => {
            void queryClient.invalidateQueries({
                queryKey: minigameKeys.detail(id),
            });
            notify.neutral("Settings updated.");
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            notify.negative(error?.response?.data?.detail ?? "Failed to update settings.");
        },
    });
}

export function useMoveTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: MoveTeamInput) => {
            const { id, teamId } = input;
            await http.post(`/api/minigames/${id}/move-team`, {
                team_id: teamId,
            });
        },
        onSuccess: (_data, { id }) => {
            void queryClient.invalidateQueries({
                queryKey: minigameKeys.detail(id),
            });
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            notify.negative(error?.response?.data?.detail ?? "Failed to move team.");
        },
    });
}

export function useDeleteMinigame() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (id: number) => {
            await http.delete(`/api/minigames/${id}`);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: minigameKeys.list(),
            });
            notify.neutral("Minigame deleted.");
            void navigate("/minigames");
        },
        onError: (error: AxiosError<{ detail: string }>) => {
            notify.negative(error?.response?.data?.detail ?? "Failed to delete minigame.");
        },
    });
}
