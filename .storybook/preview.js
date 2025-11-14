import "./storybook.scss";
import { a11yConfig } from "./storybook-config";
import { customViewports } from "./viewports";

/** @type { import('@storybook/html-vite').Preview } */
export default {
  parameters: {
    viewport: { options: customViewports },
    options: { showPanel: true },
    a11y: {
      config: a11yConfig,
      test: "error",
    },
  },
  tags: ["autodocs"],
};

document.documentElement.classList.add(
  "tna-template",
  "tna-template--blue-accent",
);
if (window.self !== window.top) {
  document.documentElement.classList.add("tna-template--padded");
}
document.body.classList.add("tna-template__body");
