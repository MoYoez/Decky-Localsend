import { FileSelectionType, openFilePicker } from "@decky/api";

export const openFolder = async (startPath: string = "/home/deck") => {
  return openFilePicker(FileSelectionType.FOLDER, startPath);
};
