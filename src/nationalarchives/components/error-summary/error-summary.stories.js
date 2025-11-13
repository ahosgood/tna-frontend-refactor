import Template from "./template.njk?raw";
import TextInput from "../text-input/template.njk?raw";
import macroOptions from "./macro-options.json";
import render from "../../lib/render";

export default {
  title: "Components/Error summary",
  argTypes: Object.fromEntries(
    Object.entries({
      title: { control: "text" },
      headingLevel: { control: { type: "number", min: 1, max: 6 } },
      items: { control: "object" },
      disableAutoFocus: { control: "boolean" },
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
    title: "There is a problem",
    headingLevel: 2,
    items: [
      {
        text: "Enter your full name",
        href: "#",
      },
      {
        text: "The date of the record cannot be in the future",
        href: "#",
      },
    ],
    disableAutoFocus: true,
    classes: "tna-error-summary--demo",
  },
};

const FormTemplate = ({ items }) =>
  `${
    render(Template, {
      params: {
        title: "There is a problem",
        headingLevel: 2,
        items: Array(items)
          .fill("")
          .map((item, index) => ({
            text: `Error on field ${index + 1}`,
            href: `#input-${index + 1}`,
          })),
        disableAutoFocus: true,
        classes: "tna-error-summary--demo",
      },
    }).outerHTML
  }${Array(items)
    .fill("")
    .map(
      (item, index) =>
        render(TextInput, {
          params: {
            label: `Field ${index + 1}`,
            id: `input-${index + 1}`,
            name: `input-${index + 1}`,
            error: {
              text: "There is a problem",
            },
          },
        }).outerHTML,
    )
    .join("")}`;

export const ScrollExample = FormTemplate.bind({});
ScrollExample.args = {
  items: 24,
};
