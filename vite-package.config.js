import { mergeConfig } from "vite";
import baseConfig from "./vite.config";
import { viteStaticCopy } from "vite-plugin-static-copy";

/**
 * ======================================
 * Vite configuration for building an npm
 * package
 * ======================================
 */
/** @type {import('vite').UserConfig} */
const config = mergeConfig(baseConfig, {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "nationalarchives",
          dest: ".",
        },
      ],
      structured: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: "../node_modules/@fortawesome/fontawesome-free/webfonts/*.woff2",
          dest: "nationalarchives/assets/fonts",
        },
        {
          src: ["../package.json", "../package-lock.json", "../README.md"],
          dest: ".",
        },
        {
          src: [
            "../eslint.config.mjs",
            "../.htmlvalidate.json",
            "../stylelint.config.js",
          ],
          dest: "./config",
        },
        // {
        //   src: "**/*.njk",
        //   dest: ".",
        //   // rename: (fileName, fileExtension, fullPath) =>
        //   //   fullPath.replace(/^.*\/src\/nationalarchives\//, "./"),
        // },
      ],
    }),
  ],
});

export default config;
