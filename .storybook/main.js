import { viteStaticCopy } from "vite-plugin-static-copy";

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      plugins: [
        viteStaticCopy({
          targets: [
            // {
            //   src: "node_modules/@fortawesome/fontawesome-free/webfonts/*.woff2",
            //   dest: "assets/assets/fonts",
            // },
            {
              src: "src/**/*.njk",
              dest: ".",
            },
          ],
          structured: true,
        }),
      ],
    });
  },
};
export default config;
