import {
  ConfirmModal,
  Field,
  TextField,
} from "@decky/ui";
import { useState } from "react";
import { t } from "../i18n";

interface basicInputBoxModalProps {
  title?: string;
  label?: string;
  onSubmit: (inputValue: string) => void;
  onCancel: () => void;
  closeModal?: () => void;
}

export const BasicInputBoxModal = ({
  title = "",
  label = "",
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
    <ConfirmModal
      strTitle={title}
      onOK={handleSubmit}
      onCancel={handleCancel}
      closeModal={closeModal}
      bOKDisabled={!inputValue.trim()}
      strOKButtonText={t("common.confirm")}
      strCancelButtonText={t("common.cancel")}
    >
      <Field label={label}>
        <TextField
          value={inputValue}
          onChange={(e) => setInputValue(e?.target?.value || "")}
          style={{ width: "100%", minWidth: "200px" }}
        />
      </Field>
    </ConfirmModal>
  );
};
