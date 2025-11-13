import Template from "./template.njk?raw";
import macroOptions from "./macro-options.json";
import render from "../../lib/render";

export default {
  title: "Components/Back link",
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
  render: (params) => render(Template, { params }),
};

export const Standard = {
  args: {
    text: "Back to previous page",
    href: "#",
  },
};
