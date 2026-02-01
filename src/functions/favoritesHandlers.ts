import { toaster } from "@decky/api";
import { proxyGet, proxyPost, proxyDelete } from "../utils/proxyReq";
import { t } from "../i18n";

export interface FavoriteDevice {
  favorite_fingerprint: string;
  favorite_alias: string;
}

/** GET /api/self/v1/favorites response: { data: FavoriteDevice[] } */
interface FavoritesListResponse {
  data: FavoriteDevice[];
}

// Helper: fetch favorites from API (no backendRunning check, always fetches)
const fetchFavoritesFromApi = async (): Promise<FavoriteDevice[]> => {
  try {
    const result = await proxyGet("/api/self/v1/favorites");
    if (result.status !== 200) return [];
    const body = result.data as FavoritesListResponse | undefined;
    return Array.isArray(body?.data) ? body.data : [];
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    return [];
  }
};

export const createFavoritesHandlers = (
  backendRunning: boolean,
  setFavorites: (favorites: FavoriteDevice[]) => void
) => {
  // Fetch favorites list - GET /api/self/v1/favorites
  // When backend is not running, do NOT clear favorites (avoids clearing on re-enter before status is fetched).
  const fetchFavorites = async () => {
    if (!backendRunning) {
      return;
    }
    const list = await fetchFavoritesFromApi();
    setFavorites(list);
  };

  // Add device to favorites - POST /api/self/v1/favorites
  // Body: { fingerprint, alias }, backend returns FastReturnSuccess() => { status: "ok" }
  // Uses optimistic update + re-fetch to avoid closure issues
  const handleAddToFavorites = async (fingerprint: string, alias: string) => {
    try {
      const result = await proxyPost("/api/self/v1/favorites", {
        favorite_fingerprint: fingerprint,
        favorite_alias: alias,
      });
      if (result.status === 200) {
        toaster.toast({
          title: t("config.favoritesAdded"),
          body: alias || fingerprint,
        });
        // Directly fetch from API to avoid closure issue with backendRunning
        const list = await fetchFavoritesFromApi();
        setFavorites(list);
      } else {
        const errMsg = (result.data as { error?: string })?.error ?? "Failed to add favorite";
        throw new Error(errMsg);
      }
    } catch (error) {
      toaster.toast({
        title: t("common.error"),
        body: String(error),
      });
    }
  };

  // Remove device from favorites - DELETE /api/self/v1/favorites/:fingerprint
  // Backend returns FastReturnSuccess() => { status: "ok" }
  // Uses optimistic update + re-fetch to avoid closure issues
  const handleRemoveFromFavorites = async (fingerprint: string) => {
    try {
      const result = await proxyDelete(`/api/self/v1/favorites/${encodeURIComponent(fingerprint)}`);
      if (result.status === 200) {
        toaster.toast({
          title: t("config.favoritesRemoved"),
          body: "",
        });
        // Directly fetch from API to avoid closure issue with backendRunning
        const list = await fetchFavoritesFromApi();
        setFavorites(list);
      } else {
        const errMsg = (result.data as { error?: string })?.error ?? "Failed to remove favorite";
        throw new Error(errMsg);
      }
    } catch (error) {
      toaster.toast({
        title: t("common.error"),
        body: String(error),
      });
    }
  };

  return { fetchFavorites, handleAddToFavorites, handleRemoveFromFavorites };
};
