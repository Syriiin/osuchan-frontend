import { DBSchema, openDB } from "idb";

interface BeatmapCacheDB extends DBSchema {
    beatmaps: {
        key: number;
        value: string;
    };
}

const dbPromise = openDB<BeatmapCacheDB>("beatmapcache", 1, {
    upgrade(db) {
        db.createObjectStore("beatmaps");
    },
});

export async function getBeatmap(beatmapId: number) {
    const db = await dbPromise;
    return await db.get("beatmaps", beatmapId);
}

export async function setBeatmap(beatmapId: number, fileData: string) {
    const db = await dbPromise;
    await db.put("beatmaps", fileData, beatmapId);
}
