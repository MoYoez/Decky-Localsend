import { showModal } from "@decky/ui";
import { PinPromptModal } from "../components/PinPromptModal";

export const requestPin = (title?: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const modal = showModal(
      <PinPromptModal
        title={title}
        onSubmit={(pin) => {
          resolve(pin);
          modal.Close();
        }}
        onCancel={() => {
          resolve(null);
          modal.Close();
        }}
        closeModal={() => modal.Close()}
      />
    );
  });
};
