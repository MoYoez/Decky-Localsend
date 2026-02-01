import { FC } from "react";
import { ButtonItem, PanelSectionRow, Navigation } from "@decky/ui";
import { FiGithub } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { t } from "../i18n";

const PROTOCOL_GITHUB_URL = "https://github.com/localsend/protocol";
const PLUGIN_GITHUB_URL = "https://github.com/MoYoez/Decky-Localsend";
const DEVELOPER_GITHUB_URL = "https://github.com/MoYoez";

export const About: FC = () => {
  return (
    <div>
      <h2
        style={{ fontWeight: "bold", fontSize: "1.5em", marginBottom: "0px" }}
      >
        {t("about.pluginTitle")}
      </h2>
      <span style={{ marginBottom: "10px 10px" }}>
        {t("about.pluginDesc")}
        <br />
      </span>
      <PanelSectionRow>
        <span>{t("about.starOnGitHub")}</span>
        <ButtonItem
          icon={<FiGithub style={{ display: "block" }} />}
          label={t("about.pluginRepo")}
          onClick={() => {
            Navigation.NavigateToExternalWeb(PLUGIN_GITHUB_URL);
          }}
        >
          {t("about.githubRepo")}
        </ButtonItem>
      </PanelSectionRow>
      <h3
        style={{ fontWeight: "bold", fontSize: "1.5em", marginBottom: "0px" }}
      >
        {t("about.developer")}
      </h3>
      <PanelSectionRow>
        <ButtonItem
          icon={<FaGithub style={{ display: "block" }} />}
          label="MoeMagicMango"
          onClick={() => {
            Navigation.NavigateToExternalWeb(DEVELOPER_GITHUB_URL);
          }}
        >
          {t("about.githubProfile")}
        </ButtonItem>
      </PanelSectionRow>

      <h2
        style={{ fontWeight: "bold", fontSize: "1.5em", marginBottom: "5px" }}
      >
        {t("about.dependencies")}
      </h2>
      <PanelSectionRow>
        <span>{t("about.protocolDesc")}</span>
        <ButtonItem
          icon={<FiGithub style={{ display: "block" }} />}
          label={"localsend/protocol"}
          onClick={() => {
            Navigation.NavigateToExternalWeb(PROTOCOL_GITHUB_URL);
          }}
        >
          {t("about.githubRepo")}
        </ButtonItem>
      </PanelSectionRow>
    </div>
  );
};