import {
  DialogBody,
  DialogButton,
  DialogHeader,
  Focusable,
  ModalRoot,
} from "@decky/ui";
import { t } from "../i18n";

interface NetworkInterfaceSelectModalProps {
  options: { label: string; value: string }[];
  currentValue: string;
  onSelect: (value: string) => void;
  closeModal: () => void;
}

export const NetworkInterfaceSelectModal = ({
  options,
  currentValue,
  onSelect,
  closeModal,
}: NetworkInterfaceSelectModalProps) => {
  return (
    <ModalRoot onCancel={closeModal} closeModal={closeModal}>
      <DialogHeader>{t("config.networkInterface")}</DialogHeader>
      <DialogBody>
        <div style={{ fontSize: "14px", color: "#b8b6b4", marginBottom: "12px" }}>
          {t("config.networkInterfaceDesc")}
        </div>
        <Focusable style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {options.map((option) => (
            <DialogButton
              key={option.value}
              onClick={() => onSelect(option.value)}
              style={{
                backgroundColor: currentValue === option.value ? "#1a9fff" : undefined,
              }}
            >
              {option.label}
            </DialogButton>
          ))}
        </Focusable>
      </DialogBody>
    </ModalRoot>
  );
};
