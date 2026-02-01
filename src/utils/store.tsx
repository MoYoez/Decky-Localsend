import { create } from 'zustand';
import type { FavoriteDevice } from '../functions/favoritesHandlers';

// Type definitions
type ScanDevice = {
  alias?: string;
  ip_address?: string;
  deviceModel?: string;
  deviceType?: string;
  fingerprint?: string;
  port?: number;
  protocol?: string;
};

type FileInfo = {
  id: string;
  fileName: string;
  sourcePath: string;
  // Optional text content for text-based files
  textContent?: string;
  // For folder items
  isFolder?: boolean;
  folderPath?: string;
  fileCount?: number;
};

// Share link session with expiry tracking
interface ShareLinkSessionWithExpiry {
  sessionId: string;
  downloadUrl: string;
  createdAt: number; // timestamp
}

// Pending share files (files selected but not yet shared)
interface PendingShare {
  files: FileInfo[];
}

// Store state interface
interface LocalSendStore {
  // Available devices state
  devices: ScanDevice[];
  setDevices: (devices: ScanDevice[]) => void;
  
  // Selected device state
  selectedDevice: ScanDevice | null;
  setSelectedDevice: (device: ScanDevice | null) => void;
  
  // Selected files state (includes folders as items)
  selectedFiles: FileInfo[];
  setSelectedFiles: (files: FileInfo[]) => void;
  addFile: (file: FileInfo) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;

  // Share via link session (preserved when navigating to SharedViaLinkPage)
  shareLinkSession: ShareLinkSessionWithExpiry | null;
  setShareLinkSession: (session: ShareLinkSessionWithExpiry | null) => void;

  // Pending share (files to share, before creating session)
  pendingShare: PendingShare | null;
  setPendingShare: (pending: PendingShare | null) => void;

  // Favorites (preserved when modal closes / Content remounts so heart stays lit)
  favorites: FavoriteDevice[];
  setFavorites: (favorites: FavoriteDevice[]) => void;
  
  // Reset all state
  resetAll: () => void;
}

// Create the store
export const useLocalSendStore = create<LocalSendStore>((set) => ({
  // Initial state
  devices: [],
  selectedDevice: null,
  selectedFiles: [],
  shareLinkSession: null,
  pendingShare: null,
  favorites: [],

  // Actions for devices
  setDevices: (devices) => set({ devices }),
  
  // Actions for selected device
  setSelectedDevice: (device) => set({ selectedDevice: device }),
  
  // Actions for selected files
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  
  addFile: (file) => set((state) => {
    // Prevent duplicate files
    if (file.textContent) {
      // For text files, check if same text content already exists
      if (state.selectedFiles.some((item) => item.textContent === file.textContent && item.fileName === file.fileName)) {
        return state;
      }
    } else if (file.isFolder && file.folderPath) {
      // For folders, check by folderPath
      if (state.selectedFiles.some((item) => item.isFolder && item.folderPath === file.folderPath)) {
        return state;
      }
    } else {
      // For regular files, check by sourcePath
      if (state.selectedFiles.some((item) => !item.isFolder && item.sourcePath === file.sourcePath)) {
        return state;
      }
    }
    return { selectedFiles: [...state.selectedFiles, file] };
  }),
  
  removeFile: (fileId) => set((state) => ({
    selectedFiles: state.selectedFiles.filter((file) => file.id !== fileId),
  })),
  
  clearFiles: () => set({ selectedFiles: [] }),

  setShareLinkSession: (session) => set({ shareLinkSession: session }),

  setPendingShare: (pending) => set({ pendingShare: pending }),

  setFavorites: (favorites) => set({ favorites }),

  // Reset all state to initial values
  resetAll: () => set({
    devices: [],
    selectedDevice: null,
    selectedFiles: [],
    shareLinkSession: null,
    pendingShare: null,
    favorites: [],
  }),
}));
