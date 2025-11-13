/**
 * ======================================
 * Base Vite configuration, used for both
 * creating an npm package and developing
 * and building Storybook
 * ======================================
 */
/** @type {import('vite').UserConfig} */
export default {
  root: "src",
  publicDir: "package",
  build: {
    outDir: "../package",
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: "nationalarchives/all.mjs",
      name: "TNAFrontend",
      fileName: (format, entryName) => `nationalarchives/${entryName}.min.js`,
      formats: ["iife"],
      cssFileName: "nationalarchives/all.min",
    },
  },
};
