import {
  DialogBody,
  DialogButton,
  DialogHeader,
  Focusable,
  ModalRoot,
} from "@decky/ui";
import { t } from "../i18n";
import type { FavoriteDevice } from "../functions/favoritesHandlers";

interface FavoritesAddModalProps {
  devices: { fingerprint?: string; alias?: string; ip_address?: string }[];
  favorites: FavoriteDevice[];
  onAdd: (fingerprint: string, alias: string) => void;
  closeModal: () => void;
}

export const FavoritesAddModal = ({
  devices,
  favorites,
  onAdd,
  closeModal,
}: FavoritesAddModalProps) => {
  // Filter out already favorited devices
  const availableDevices = devices.filter(
    (d) => d.fingerprint && !favorites.some((f) => f.favorite_fingerprint === d.fingerprint)
  );

  return (
    <ModalRoot onCancel={closeModal} closeModal={closeModal}>
      <DialogHeader>{t("config.favoritesAdd")}</DialogHeader>
      <DialogBody>
        {availableDevices.length === 0 ? (
          <div style={{ fontSize: "14px", color: "#b8b6b4" }}>
            {t("backend.noDevices")}
          </div>
        ) : (
          <Focusable style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {availableDevices.map((device) => (
              <DialogButton
                key={device.fingerprint}
                onClick={() => onAdd(device.fingerprint!, device.alias || "")}
              >
                {device.alias || device.ip_address || device.fingerprint}
              </DialogButton>
            ))}
          </Focusable>
        )}
      </DialogBody>
    </ModalRoot>
  );
};
