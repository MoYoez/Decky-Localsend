import { PanelSection, PanelSectionRow } from "@decky/ui";
import { t } from "../i18n";
import type { UploadProgress } from "../types/upload";

interface SendProgressPanelProps {
  uploadProgress: UploadProgress[];
}

/**
 * Panel block showing send progress (X / Y files) during an upload session.
 * Shown in the upload section when uploadProgress has items.
 */
export const SendProgressPanel = ({ uploadProgress }: SendProgressPanelProps) => {
  const totalFiles = uploadProgress.length;
  const completedCount = uploadProgress.filter(
    (p) => p.status === "done" || p.status === "error"
  ).length;
  const currentItem = uploadProgress.find((p) => p.status === "uploading");
  const currentFileName = currentItem?.fileName ?? "";
  const percent =
    totalFiles > 0
      ? Math.min(100, Math.round((completedCount / totalFiles) * 100))
      : 0;

  return (
    <PanelSection title={t("sendProgress.sending")}>
      <PanelSectionRow>
        <div style={{ width: "100%" }}>
          <div
            style={{
              marginBottom: "8px",
              fontSize: "14px",
              color: "#b8b6b4",
            }}
          >
            {t("sendProgress.filesCount")
              .replace("{current}", String(completedCount))
              .replace("{total}", String(totalFiles))}
          </div>
          <div
            style={{
              height: "12px",
              backgroundColor: "#3d3d3d",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percent}%`,
                backgroundColor: "#4a9eff",
                borderRadius: "6px",
                transition: "width 0.2s ease",
              }}
            />
          </div>
          {currentFileName && (
            <div
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#888",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentFileName}
            </div>
          )}
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
};
