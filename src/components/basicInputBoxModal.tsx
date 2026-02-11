import {
    DialogBody,
    DialogButton,
    DialogButtonPrimary,
    DialogFooter,
    DialogHeader,
    Field,
    ModalRoot,
    TextField,
  } from "@decky/ui";
  import { useState } from "react";
  import { t } from "../i18n";
    
  interface basicInputBoxModalProps {
    title?: string;
    label?: string;
    /** When true, show a resizable textarea instead of single-line input */
    multiline?: boolean;
    onSubmit: (inputValue: string) => void;
    onCancel: () => void;
    closeModal?: () => void;
  }

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    minWidth: "200px",
    minHeight: "120px",
    maxHeight: "320px",
    resize: "vertical",
    padding: "8px 12px",
    boxSizing: "border-box",
    fontFamily: "inherit",
    fontSize: "14px",
  };
  
  export const BasicInputBoxModal = ({
    title = "",
    label = "",
    multiline = false,
    onSubmit,
    onCancel,
    closeModal,
  }: basicInputBoxModalProps) => {
    const [inputValue, setInputValue] = useState("");
  
    const handleCancel = () => {
      closeModal?.();
      onCancel();
    };
  
    const handleSubmit = () => {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      closeModal?.();
      onSubmit(inputValue);
    };
  
    return (
      <ModalRoot onCancel={handleCancel} closeModal={closeModal}>
        <DialogHeader>{title}</DialogHeader>
        <DialogBody>
          <Field label={label}>
            {multiline ? (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={6}
                style={textareaStyle}
                placeholder=""
              />
            ) : (
              <TextField
                value={inputValue}
                onChange={(e) => setInputValue(e?.target?.value || "")}
                style={{ width: "100%", minWidth: "200px" }}
              />
            )}
          </Field>
        </DialogBody>
        <DialogFooter>
            <DialogButton onClick={handleCancel} style={{marginTop: "10px"}}>{t("common.cancel")}</DialogButton>
          <DialogButtonPrimary onClick={handleSubmit} disabled={!inputValue.trim()} style={{marginTop: "10px"}}>
            {t("common.confirm")}
          </DialogButtonPrimary>
        </DialogFooter>
      </ModalRoot>
    );
  };
  