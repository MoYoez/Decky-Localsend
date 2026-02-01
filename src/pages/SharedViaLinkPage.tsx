import { FC, useEffect, useState, CSSProperties } from "react";
import {
  PanelSection,
  PanelSectionRow,
  ButtonItem,
  Field,
  Focusable,
  Router,
  ToggleField,
  showModal,
} from "@decky/ui";
import { toaster } from "@decky/api";
import { useLocalSendStore } from "../utils/store";
import { closeShareSession, createShareSession } from "../functions/shareHandlers";
import { copyToClipboard } from "../utils/copyClipBoard";
import { getBackendStatus } from "../functions";
import { BasicInputBoxModal } from "../components/basicInputBoxModal";
import { t } from "../i18n";

// One hour in milliseconds
const ONE_HOUR_MS = 60 * 60 * 1000;

export const SharedViaLinkPage: FC = () => {
  const shareLinkSession = useLocalSendStore((state) => state.shareLinkSession);
  const setShareLinkSession = useLocalSendStore((state) => state.setShareLinkSession);
  const pendingShare = useLocalSendStore((state) => state.pendingShare);
  const setPendingShare = useLocalSendStore((state) => state.setPendingShare);

  // Backend status
  const [backendRunning, setBackendRunning] = useState(false);

  // Create share settings
  const [sharePin, setSharePin] = useState("");
  const [autoAccept, setAutoAccept] = useState(true);
  const [creating, setCreating] = useState(false);

  // Expiry timer
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  // Check backend status
  useEffect(() => {
    getBackendStatus()
      .then((status) => setBackendRunning(status.running))
      .catch(() => setBackendRunning(false));
  }, []);

  // Update remaining time every second
  useEffect(() => {
    if (!shareLinkSession?.createdAt) {
      setRemainingTime(null);
      return;
    }

    const updateRemaining = () => {
      const elapsed = Date.now() - shareLinkSession.createdAt;
      const remaining = ONE_HOUR_MS - elapsed;
      if (remaining <= 0) {
        // Session expired - auto close
        setRemainingTime(0);
        handleExpired();
      } else {
        setRemainingTime(remaining);
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [shareLinkSession?.createdAt]);

  // Handle session expiry
  const handleExpired = async () => {
    if (shareLinkSession) {
      try {
        await closeShareSession(shareLinkSession.sessionId);
      } catch {
        // Ignore errors on expiry cleanup
      }
      setShareLinkSession(null);
      toaster.toast({ title: t("shareLink.expired"), body: "" });
    }
  };

  const handleCopy = async () => {
    if (!shareLinkSession) return;
    const ok = await copyToClipboard(shareLinkSession.downloadUrl);
    if (ok) {
      toaster.toast({ title: t("shareLink.copied"), body: "" });
    }
  };

  const handleCloseSession = async () => {
    if (!shareLinkSession) return;
    try {
      await closeShareSession(shareLinkSession.sessionId);
      setShareLinkSession(null);
      toaster.toast({ title: t("shareLink.shareEnded"), body: "" });
    } catch (error) {
      toaster.toast({ title: t("common.error"), body: String(error) });
    }
  };

  // Create share with settings
  const handleStartShare = async () => {
    if (!pendingShare?.files || pendingShare.files.length === 0) {
      toaster.toast({ title: t("common.error"), body: t("shareLink.selectFiles") });
      return;
    }
    if (!backendRunning) {
      toaster.toast({ title: t("common.error"), body: t("shareLink.backendRequired") });
      return;
    }

    setCreating(true);
    try {
      const { sessionId, downloadUrl } = await createShareSession(
        pendingShare.files,
        sharePin || undefined,
        autoAccept
      );
      setShareLinkSession({
        sessionId,
        downloadUrl,
        createdAt: Date.now(),
      });
      setPendingShare(null); // Clear pending after creating
      toaster.toast({ title: t("common.success"), body: "" });
    } catch (error) {
      toaster.toast({ title: t("common.error"), body: String(error) });
    } finally {
      setCreating(false);
    }
  };

  // Cancel creating share
  const handleCancelCreate = () => {
    setPendingShare(null);
    Router.Navigate("/decky-localsend-config");
  };

  // Edit PIN with modal
  const handleEditPin = () => {
    const modal = showModal(
      <BasicInputBoxModal
        title={t("shareLink.pinForShare")}
        label={t("shareLink.enterPin")}
        onSubmit={(value) => {
          setSharePin(value);
          modal.Close();
        }}
        onCancel={() => modal.Close()}
        closeModal={() => modal.Close()}
      />
    );
  };

  // Format remaining time
  const formatRemainingTime = (ms: number): string => {
    if (ms <= 0) return t("shareLink.expired");
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")} ${t("shareLink.minutes")}`;
  };

  // Generate QR code URL using external service
  const getQRCodeUrl = (url: string): string => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const scrollContainerStyle: CSSProperties = {
    padding: "16px",
    overflowY: "auto",
    height: "100%",
    boxSizing: "border-box",
  };

  // Backend not running warning
  if (!backendRunning) {
    return (
      <div style={scrollContainerStyle}>
        <PanelSection title={t("shareLink.title")}>
          <PanelSectionRow>
            <Field label={t("shareLink.backendRequired")}>
              {t("backend.stopped")}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={() => Router.Navigate("/decky-localsend-config")}>
              {t("common.cancel")}
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      </div>
    );
  }

  // Pending share - show create settings page
  if (pendingShare && pendingShare.files.length > 0) {
    return (
      <div style={scrollContainerStyle}>
        <PanelSection title={t("shareLink.createShareSettings")}>
          <PanelSectionRow>
            <Field label={t("upload.selectedFiles")}>
              {pendingShare.files.length} {t("common.files")}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <Focusable style={{ maxHeight: "120px", overflowY: "auto" }}>
              {pendingShare.files.map((file) => (
                <div
                  key={file.id}
                  style={{
                    padding: "4px 0",
                    fontSize: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.isFolder
                    ? `📁 ${file.fileName} (${file.fileCount} ${t("upload.folderFiles")})`
                    : file.fileName}
                </div>
              ))}
            </Focusable>
          </PanelSectionRow>
        </PanelSection>

        <PanelSection title={t("config.securityConfig")}>
          <PanelSectionRow>
            <Field label={t("shareLink.pinForShare")}>
              {sharePin ? "******" : t("config.pinNotSet")}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={handleEditPin}>
              {t("config.editPin")}
            </ButtonItem>
          </PanelSectionRow>
          {sharePin && (
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={() => setSharePin("")}>
                {t("config.clearPin")}
              </ButtonItem>
            </PanelSectionRow>
          )}
          <PanelSectionRow>
            <ToggleField
              label={t("shareLink.autoAccept")}
              description={t("shareLink.autoAcceptDesc")}
              checked={autoAccept}
              onChange={setAutoAccept}
            />
          </PanelSectionRow>
        </PanelSection>

        <PanelSection>
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={handleStartShare} disabled={creating}>
              {creating ? "..." : t("shareLink.startShare")}
            </ButtonItem>
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={handleCancelCreate}>
              {t("shareLink.cancelCreate")}
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      </div>
    );
  }

  // No active share
  if (!shareLinkSession) {
    return (
      <div style={scrollContainerStyle}>
        <PanelSection title={t("shareLink.title")}>
          <PanelSectionRow>
            <Field label={t("shareLink.noActiveShare")}>
              {t("shareLink.createFromMain")}
            </Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={() => Router.Navigate("/decky-localsend-config")}>
              {t("common.cancel")}
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      </div>
    );
  }

  // Active share - show link, QR code, and controls
  return (
    <div style={scrollContainerStyle}>
      <PanelSection title={t("shareLink.title")}>
        <PanelSectionRow>
          <div style={{ marginBottom: "8px", fontSize: "12px", color: "#b8b6b4" }}>
            {t("shareLink.accessHint")}
          </div>
        </PanelSectionRow>
        {shareLinkSession.downloadUrl.startsWith("https://") && (
          <PanelSectionRow>
            <div style={{ marginBottom: "8px", fontSize: "12px", color: "#f0b429" }}>
              {t("shareLink.httpsCertHint")}
            </div>
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <div style={{ marginBottom: "8px", fontSize: "12px", color: "#b8b6b4" }}>
            {t("shareLink.httpHint")}
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={{ marginBottom: "8px", fontSize: "12px", color: "#b8b6b4" }}>
            {t("shareLink.sameNetworkHint")}
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={{ marginBottom: "10px", fontSize: "12px", color: "#b8b6b4" }}>
            {t("shareLink.description")}
          </div>
        </PanelSectionRow>
        <PanelSectionRow>
          <Field label={t("shareLink.Link")}>
            {shareLinkSession.downloadUrl.replace(/\/\?.*$/, "").replace(/\/$/, "")}
          </Field>
        </PanelSectionRow>
        {/* Session ID */}
        <PanelSectionRow>
          <Field label={t("shareLink.sessionId")}>
            {shareLinkSession.sessionId}
          </Field>
        </PanelSectionRow>

        {/* Expiry time */}
        {remainingTime !== null && (
          <PanelSectionRow>
            <Field label={t("shareLink.expiresIn")}>
              <span style={{ color: remainingTime < 5 * 60 * 1000 ? "#ff6b6b" : "#4ade80" }}>
                {formatRemainingTime(remainingTime)}
              </span>
            </Field>
          </PanelSectionRow>
        )}

        {/* Download URL */}
        <PanelSectionRow>
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
                {t('shareLink.orVisitDirect')}:   {shareLinkSession.downloadUrl}
          </Focusable>
        </PanelSectionRow>

        {/* QR Code */}
        <PanelSectionRow>
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", marginBottom: "8px", color: "#b8b6b4" }}>
              {t("shareLink.qrCode")}
            </div>
            <img
              src={getQRCodeUrl(shareLinkSession.downloadUrl)}
              alt="QR Code"
              style={{
                width: "200px",
                height: "200px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                padding: "8px",
              }}
            />
          </div>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleCopy}>
            {t("shareLink.copyLink")}
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleCloseSession}>
            {t("shareLink.closeShare")}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );
};
