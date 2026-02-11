import { PanelSection, PanelSectionRow } from "@decky/ui";
import { t } from "../i18n";
import type { ReceiveProgressState } from "../utils/store";

interface ReceiveProgressPanelProps {
  receiveProgress: ReceiveProgressState;
}

/**
 * Panel block showing receive progress (X / Y files) during an upload session.
 * Shown on the Decky panel when receiveProgress is set.
 */
export const ReceiveProgressPanel = ({ receiveProgress }: ReceiveProgressPanelProps) => {
  const { totalFiles, completedCount, currentFileName } = receiveProgress;
  const percent = totalFiles > 0 ? Math.min(100, Math.round((completedCount / totalFiles) * 100)) : 0;

  return (
    <PanelSection title={t("receiveProgress.receiving")}>
      <PanelSectionRow>
        <div style={{ width: "100%" }}>
          <div
            style={{
              marginBottom: "8px",
              fontSize: "14px",
              color: "#b8b6b4",
            }}
          >
            {t("receiveProgress.filesCount")
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
