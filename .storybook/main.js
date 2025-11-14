import { viteStaticCopy } from "vite-plugin-static-copy";

/** @type { import('@storybook/html-vite').StorybookConfig } */
export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import("vite");

    let plugins = [
      viteStaticCopy({
        targets: [
          {
            src: "node_modules/@fortawesome/fontawesome-free/webfonts/*.woff2",
            dest: "assets/fonts",
          },
        ],
      }),
    ];

    if (configType === "PRODUCTION") {
      plugins.push(
        viteStaticCopy({
          targets: [
            {
              src: "src/**/*.njk",
              dest: ".",
            },
          ],
          structured: true,
        }),
      );
    }

    return mergeConfig(config, {
      plugins,
    });
  },
};
