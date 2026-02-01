import {
  DialogBody,
  DialogButton,
  DialogFooter,
  DialogHeader,
  Focusable,
  ModalRoot,
} from "@decky/ui";
import { toaster } from "@decky/api";
import { t } from "../i18n";
import { copyToClipboard } from "../utils/copyClipBoard";

interface ShareLinkModalProps {
  downloadUrl: string;
  onCloseSession: () => void | Promise<void>;
  closeModal?: () => void;
}

export const ShareLinkModal = ({
  downloadUrl,
  onCloseSession,
  closeModal,
}: ShareLinkModalProps) => {
  const handleCopy = async () => {
    const ok = await copyToClipboard(downloadUrl);
    if (ok) {
      toaster.toast({ title: t("shareLink.copied"), body: "" });
    }
  };

  const handleCloseSession = async () => {
    await onCloseSession();
    closeModal?.();
  };

  return (
    <ModalRoot closeModal={closeModal}>
      <DialogHeader>{t("shareLink.title")}</DialogHeader>
      <DialogBody>
        <div style={{ marginBottom: "10px", fontSize: "12px", color: "#b8b6b4" }}>
          {t("shareLink.description")}
        </div>
        <Focusable
          style={{
            padding: "8px 10px",
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: "6px",
            fontSize: "11px",
            wordBreak: "break-all",
            marginBottom: "12px",
          }}
        >
          {downloadUrl}
        </Focusable>
      </DialogBody>
      <DialogFooter>
        <DialogButton onClick={handleCopy} style={{ marginTop: "10px" }}>
          {t("shareLink.copyLink")}
        </DialogButton>
        <DialogButton onClick={handleCloseSession} style={{ marginTop: "10px" }}>
          {t("shareLink.closeShare")}
        </DialogButton>
      </DialogFooter>
    </ModalRoot>
  );
};
