import { PanelSection, PanelSectionRow, ButtonItem, showModal, ModalRoot, DialogHeader, DialogBody, DialogButton, TextField } from "@decky/ui";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import type { ScanDevice } from "../types/devices";
import type { FavoriteDevice } from "../functions/favoritesHandlers";
import { t } from "../i18n";

interface DevicesPanelProps {
  devices: ScanDevice[];
  selectedDevice: ScanDevice | null;
  onSelectDevice: (device: ScanDevice | null) => void;
  favorites?: FavoriteDevice[];
  onAddToFavorites?: (fingerprint: string, alias: string) => Promise<void>;
  onRemoveFromFavorites?: (fingerprint: string) => Promise<void>;
}

// Modal for editing favorite alias
const EditFavoriteAliasModal = ({
  device,
  onSave,
  closeModal,
}: {
  device: ScanDevice;
  onSave: (alias: string) => void;
  closeModal: () => void;
}) => {
  const [alias, setAlias] = useState(device.alias || "");
  
  return (
    <ModalRoot onCancel={closeModal} closeModal={closeModal}>
      <DialogHeader>{t("config.editFavoriteAlias")}</DialogHeader>
      <DialogBody>
        <TextField
          label={t("config.deviceAlias")}
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <DialogButton onClick={closeModal}>{t("common.cancel")}</DialogButton>
          <DialogButton onClick={() => onSave(alias)}>{t("common.confirm")}</DialogButton>
        </div>
      </DialogBody>
    </ModalRoot>
  );
};

function DevicesPanel({ 
  devices, 
  selectedDevice, 
  onSelectDevice,
  favorites = [],
  onAddToFavorites,
  onRemoveFromFavorites,
}: DevicesPanelProps) {
  const isFavorite = (fingerprint: string) => 
    favorites.some((f) => f.favorite_fingerprint === fingerprint);

  const handleFavoriteClick = (device: ScanDevice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!device.fingerprint) return;

    if (isFavorite(device.fingerprint)) {
      // Already a favorite: click to remove
      if (onRemoveFromFavorites) {
        onRemoveFromFavorites(device.fingerprint);
      }
      return;
    }

    // Not a favorite: show modal to add with alias
    if (!onAddToFavorites) return;
    const modal = showModal(
      <EditFavoriteAliasModal
        device={device}
        onSave={async (alias) => {
          await onAddToFavorites(device.fingerprint!, alias);
          modal.Close();
        }}
        closeModal={() => modal.Close()}
      />
    );
  };

  return (
    <PanelSection title={t("backend.availableDevices")}>
      {devices.length === 0 ? (
        <PanelSectionRow>
          <div>{t("backend.noDevices")}</div>
        </PanelSectionRow>
      ) : (
        devices.map((device, index) => (
          <PanelSectionRow key={`${device.fingerprint ?? device.alias ?? "device"}-${index}`}>
            <ButtonItem 
              layout="below" 
              onClick={() => {
                // Toggle selection: if already selected, deselect; otherwise select
                if (selectedDevice?.fingerprint === device.fingerprint) {
                  onSelectDevice(null);
                } else {
                  onSelectDevice(device);
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>
                    {device.alias ?? "Unknown Device"}
                    {selectedDevice?.fingerprint === device.fingerprint ? ` (${t("backend.selected")})` : ""}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {device.ip_address as string} - {device.deviceModel ?? "unknown"}
                  </div>
                </div>
                {(onAddToFavorites || onRemoveFromFavorites) && device.fingerprint && (
                  <div
                    onClick={(e) => handleFavoriteClick(device, e)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      color: isFavorite(device.fingerprint) ? "#ff6b6b" : "#888",
                    }}
                  >
                    {isFavorite(device.fingerprint) ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                  </div>
                )}
              </div>
            </ButtonItem>
          </PanelSectionRow>
        ))
      )}
    </PanelSection>
  );
}

export default DevicesPanel;