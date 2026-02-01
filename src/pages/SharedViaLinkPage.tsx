import { FC } from "react";
import {
  PanelSection,
  PanelSectionRow,
  ButtonItem,
  Field,
  Focusable,
  Router,
} from "@decky/ui";
import { toaster } from "@decky/api";
import { useLocalSendStore } from "../utils/store";
import { closeShareSession } from "../functions/shareHandlers";
import { copyToClipboard } from "../utils/copyClipBoard";
import { t } from "../i18n";

export const SharedViaLinkPage: FC = () => {
  const shareLinkSession = useLocalSendStore((state) => state.shareLinkSession);
  const setShareLinkSession = useLocalSendStore((state) => state.setShareLinkSession);

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
      Router.Navigate("/decky-localsend-config");
    } catch (error) {
      toaster.toast({ title: t("common.error"), body: String(error) });
    }
  };

  if (!shareLinkSession) {
    return (
      <div style={{ padding: "16px" }}>
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

  return (
    <div style={{ padding: "16px" }}>
      <PanelSection title={t("shareLink.title")}>
        <PanelSectionRow>
          <div style={{ marginBottom: "10px", fontSize: "12px", color: "#b8b6b4" }}>
            {t("shareLink.description")}
          </div>
        </PanelSectionRow>
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
            {shareLinkSession.downloadUrl}
          </Focusable>
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
