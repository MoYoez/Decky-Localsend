import {
  DialogBody,
  DialogButton,
  DialogButtonPrimary,
  DialogFooter,
  DialogHeader,
  Focusable,
  ModalRoot,
} from "@decky/ui";

interface ConfirmReceiveModalProps {
  title?: string;
  from: string;
  fileCount: number;
  files: { fileName: string; size?: number; fileType?: string }[];
  onConfirm: (confirmed: boolean) => void;
  closeModal?: () => void;
}

export const ConfirmReceiveModal = ({
  title = "Confirm Receive",
  from,
  fileCount,
  files,
  onConfirm,
  closeModal,
}: ConfirmReceiveModalProps) => {
  const handleConfirm = (confirmed: boolean) => {
    closeModal?.();
    onConfirm(confirmed);
  };

  return (
    <ModalRoot onCancel={() => handleConfirm(false)} closeModal={closeModal}>
      <DialogHeader>{title}</DialogHeader>
      <DialogBody>
        <div style={{ marginBottom: "10px", fontSize: "12px", color: "#b8b6b4" }}>
          Incoming files from <strong>{from || "Unknown"}</strong> ({fileCount} file(s))
        </div>
        {files.length > 0 && (
          <Focusable style={{ maxHeight: "240px", overflowY: "auto" }}>
            {files.map((file, idx) => (
              <div key={`${file.fileName}-${idx}`} style={{ padding: "4px 0", fontSize: "12px" }}>
                {file.fileName}
                {typeof file.size === "number" ? ` (${file.size} bytes)` : ""}
              </div>
            ))}
          </Focusable>
        )}
      </DialogBody>
      <DialogFooter>
        <DialogButton onClick={() => handleConfirm(false)}>Reject</DialogButton>
        <DialogButtonPrimary onClick={() => handleConfirm(true)}>Accept</DialogButtonPrimary>
      </DialogFooter>
    </ModalRoot>
  );
};
