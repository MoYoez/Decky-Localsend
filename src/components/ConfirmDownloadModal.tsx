import {
  DialogBody,
  DialogButton,
  DialogButtonPrimary,
  DialogFooter,
  DialogHeader,
  Focusable,
  ModalRoot,
} from "@decky/ui";
import { t } from "../i18n";

interface ConfirmDownloadModalProps {
  title?: string;
  message?: string;
  fileCount: number;
  files: { id?: string; fileName?: string; size?: number; fileType?: string }[];
  onConfirm: (confirmed: boolean) => void;
  closeModal?: () => void;
}

export const ConfirmDownloadModal = ({
  title,
  message,
  fileCount,
  files,
  onConfirm,
  closeModal,
}: ConfirmDownloadModalProps) => {
  const handleConfirm = (confirmed: boolean) => {
    closeModal?.();
    onConfirm(confirmed);
  };

  return (
    <ModalRoot onCancel={() => handleConfirm(false)} closeModal={closeModal}>
      <DialogHeader>{title || t("confirmDownload.title")}</DialogHeader>
      <DialogBody>
        <div style={{ marginBottom: "10px", fontSize: "12px", color: "#b8b6b4" }}>
          {message || `${t("confirmDownload.message")} ${fileCount} ${t("common.files")}`}
        </div>
        {files.length > 0 && (
          <Focusable style={{ maxHeight: "240px", overflowY: "auto" }}>
            {files.map((file, idx) => (
              <div key={`${file.id ?? file.fileName}-${idx}`} style={{ padding: "4px 0", fontSize: "12px" }}>
                {file.fileName}
                {typeof file.size === "number" ? ` (${file.size} bytes)` : ""}
              </div>
            ))}
          </Focusable>
        )}
      </DialogBody>
      <DialogFooter>
        <DialogButton onClick={() => handleConfirm(false)} style={{ marginTop: "10px" }}>
          {t("confirmDownload.reject")}
        </DialogButton>
        <DialogButtonPrimary onClick={() => handleConfirm(true)} style={{ marginTop: "10px" }}>
          {t("confirmDownload.accept")}
        </DialogButtonPrimary>
      </DialogFooter>
    </ModalRoot>
  );
};
