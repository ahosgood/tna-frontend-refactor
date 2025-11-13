import Template from "./template.njk?raw";
import macroOptions from "./macro-options.json";
import render from "../../lib/render";

export default {
  title: "Components/Phase banner",
  argTypes: Object.fromEntries(
    Object.entries({
      phase: { control: "text" },
      message: { control: "text" },
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
  render: (params) => render(Template, { params }),
};

export const Standard = {
  args: {
    phase: "beta",
    message: `This is a new service – <a href="#">give us your feedback</a> to help improve it.`,
  },
};
