import { 
  Focusable, 
  DialogHeader, 
  DialogBody, 
  DialogFooter, 
  DialogButton,
  DialogButtonPrimary,
  ModalRoot
} from "@decky/ui";
import { toaster } from "@decky/api";
import { copyToClipboard } from "../utils/copyClipBoard";
import { t } from "../i18n";

interface FileReceivedModalProps {
  title: string;
  folderPath: string;
  fileCount: number;
  files: string[];
  totalFiles?: number;
  successFiles?: number;
  failedFiles?: number;
  failedFileIds?: string[];
  onClose: () => void;
  closeModal?: () => void;
}

/**
 * Modal component for displaying file download completion notification
 * Shows folder path with copy option
 */
export const FileReceivedModal = ({ 
  title, 
  folderPath,
  fileCount,
  files,
  totalFiles,
  successFiles,
  failedFiles,
  failedFileIds,
  onClose,
  closeModal
}: FileReceivedModalProps) => {
  const hasFailures = failedFiles !== undefined && failedFiles > 0;
  
  const handleCopyPath = async () => {
    const success = await copyToClipboard(folderPath);
    
    if (success) {
      toaster.toast({
        title: t("fileReceived.pathCopied"),
        body: "",
      });
      closeModal?.();
      onClose();
    } else {
      toaster.toast({
        title: t("common.failed"),
        body: "",
      });
    }
  };

  const handleClose = () => {
    closeModal?.();
    onClose();
  };

  return (
    <ModalRoot onCancel={handleClose} closeModal={closeModal}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>
        <Focusable style={{ padding: '10px', maxHeight: '400px', overflowY: 'auto' }}>
          {/* File count info */}
          <div style={{ 
            marginBottom: '10px', 
            paddingBottom: '10px',
            borderBottom: '1px solid #3d3d3d'
          }}>
            <div style={{ 
              color: '#b8b6b4', 
              fontSize: '12px', 
              marginBottom: '5px' 
            }}>
              <strong>{t("fileReceived.fileCount")}: {fileCount}</strong>
            </div>
            {totalFiles !== undefined && (
              <div style={{ 
                color: hasFailures ? '#ff6b6b' : '#b8b6b4', 
                fontSize: '12px', 
                marginTop: '5px' 
              }}>
                {t("fileReceived.total")}: {totalFiles} | {t("fileReceived.success")}: {successFiles} | {t("fileReceived.failed")}: {failedFiles}
              </div>
            )}
          </div>

          {/* Folder path */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ 
              color: '#b8b6b4', 
              fontSize: '12px', 
              marginBottom: '5px' 
            }}>
              {t("fileReceived.folderPath")}:
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: '#0e0e0e',
              border: '1px solid #3d3d3d',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: '1.5',
              color: '#e8e8e8',
            }}>
              {folderPath}
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ 
                color: '#b8b6b4', 
                fontSize: '12px', 
                marginBottom: '5px' 
              }}>
                {t("fileReceived.files")}:
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: '#0e0e0e',
                border: '1px solid #3d3d3d',
                borderRadius: '4px',
                maxHeight: '150px',
                overflowY: 'auto',
                fontSize: '12px',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                color: '#e8e8e8',
              }}>
                {files.map((file, index) => (
                  <div key={index} style={{ marginBottom: '2px' }}>
                    • {file}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Failed files list */}
          {hasFailures && failedFileIds && failedFileIds.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ 
                color: '#ff6b6b', 
                fontSize: '12px', 
                marginBottom: '5px' 
              }}>
                {t("fileReceived.failedFileIds")}:
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: '#1a0e0e',
                border: '1px solid #5d3d3d',
                borderRadius: '4px',
                maxHeight: '100px',
                overflowY: 'auto',
                fontSize: '12px',
                fontFamily: 'monospace',
                lineHeight: '1.5',
                color: '#ff9999',
              }}>
                {failedFileIds.map((fileId, index) => (
                  <div key={index} style={{ marginBottom: '2px' }}>
                    • {fileId}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Focusable>
      </DialogBody>
      <DialogFooter>
        <DialogButton onClick={handleClose} style={{marginTop: "10px"}}>
          {t("fileReceived.close")}
        </DialogButton>
        <DialogButtonPrimary onClick={handleCopyPath} style={{marginTop: "10px"}}>
          {t("fileReceived.copyPath")}
        </DialogButtonPrimary>
      </DialogFooter>
    </ModalRoot>
  );
};
