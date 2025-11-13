import { foo } from "./components/button/button.mjs";

import "./all.scss";

const init = () =>
  window.addEventListener("DOMContentLoaded", () => {
    console.log("Hello, Storybook with Vite!");
    foo();
  });

console.log(window ?? "No window object");
console.log(foo);

init();
