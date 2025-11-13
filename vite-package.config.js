import { mergeConfig } from "vite";
import baseConfig from "./vite.config";
import { viteStaticCopy } from "vite-plugin-static-copy";

/** @type {import('vite').UserConfig} */
const config = mergeConfig(baseConfig, {
  plugins: [
    viteStaticCopy({
      targets: [
        // {
        //   src: "node_modules/@fortawesome/fontawesome-free/webfonts/*.woff2",
        //   dest: "assets/assets/fonts",
        // },
        // {
        //   src: "**/*.njk",
        //   dest: ".",
        //   // rename: (fileName, fileExtension, fullPath) =>
        //   //   fullPath.replace(/^.*\/src\/nationalarchives\//, "./"),
        // },
        {
          src: "nationalarchives",
          dest: ".",
        },
      ],
      structured: true,
    }),
  ],
});

export default config;
