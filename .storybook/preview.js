import "./storybook.scss";

/** @type { import('@storybook/html-vite').Preview } */
export default {
  // parameters: {
  //   controls: {
  //     matchers: {
  //      color: /(background|color)$/i,
  //      date: /Date$/i,
  //     },
  //   },
  // },
};

document.documentElement.classList.add(
  "tna-template",
  "tna-template--blue-accent",
);
if (window.self !== window.top) {
  document.documentElement.classList.add("tna-template--padded");
}
document.body.classList.add("tna-template__body");
