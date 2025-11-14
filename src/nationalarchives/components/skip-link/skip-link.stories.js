import Template from "./template.njk?raw";
import macroOptions from "./macro-options.json";
import { within, userEvent, expect } from "storybook/test";
import render from "../../lib/render";
import { SkipLink } from "./skip-link.mjs";

export default {
  title: "Components/Skip link",
  argTypes: Object.fromEntries(
    Object.entries({
      text: { control: "text" },
      href: { control: "text" },
      classes: { control: "text" },
      attributes: { control: "object" },
    }).map(([key, value]) => [
      key,
      {
        ...value,
        description: macroOptions.find((option) => option.name === key)
          ?.description,
      },
    ]),
  ),
  parameters: {
    chromatic: { delay: 1000 },
  },
  render: (params) => render(Template, { params }, SkipLink),
  decorators: [
    (Story) => {
      const container = document.createElement("div");
      const explainer = document.createElement("p");
      explainer.innerText =
        "To view the skip link component tab to this example, or click inside this example and press tab.";
      const mainContent = document.createElement("main");
      mainContent.setAttribute("id", "main-content");
      mainContent.classList.add("tna-main");
      mainContent.innerHTML = "<h1>Main content</h1>";
      container.appendChild(explainer);
      container.appendChild(Story());
      container.appendChild(mainContent);
      return container;
    },
  ],
};

export const Standard = {
  args: {
    classes: "tna-skip-link--demo",
  },
};

export const Test = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    text: "Skip to main content",
    href: "main-content",
    classes: "tna-skip-link--demo",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const $skipLink = canvas.getByText(args.text);
    const $linkedElement = document.getElementById(args.href);

    await expect($skipLink.getBoundingClientRect().x).toBeLessThanOrEqual(
      -$skipLink.getBoundingClientRect().width,
    );
    await expect($skipLink.getBoundingClientRect().y).toBeLessThanOrEqual(
      -$skipLink.getBoundingClientRect().height,
    );
    await expect($skipLink).not.toHaveFocus();
    await expect($linkedElement).not.toHaveFocus();
    await expect($linkedElement).not.toHaveAttribute("tabindex");

    await userEvent.keyboard("[Tab]");
    await expect($skipLink).toHaveFocus();
    await expect($skipLink.getBoundingClientRect().width).toBeGreaterThan(1);
    await expect($skipLink.getBoundingClientRect().height).toBeGreaterThan(1);
    await expect($skipLink.getBoundingClientRect().x).toBeGreaterThanOrEqual(0);
    await expect($skipLink.getBoundingClientRect().y).toBeGreaterThanOrEqual(0);

    await $skipLink.addEventListener("click", (e) => e.preventDefault());
    await userEvent.click($skipLink);
    await expect($skipLink.getBoundingClientRect().x).toBeLessThanOrEqual(
      -$skipLink.getBoundingClientRect().width,
    );
    await expect($skipLink.getBoundingClientRect().y).toBeLessThanOrEqual(
      -$skipLink.getBoundingClientRect().height,
    );
    await expect($skipLink).not.toHaveFocus();
    await expect($linkedElement).toHaveAttribute("tabindex");
    await expect($linkedElement).toHaveFocus();

    await userEvent.keyboard("[Tab]");
    await expect($linkedElement).not.toHaveFocus();
    await expect($linkedElement).not.toHaveAttribute("tabindex");
  },
};
