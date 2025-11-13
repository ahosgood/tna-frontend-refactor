import nunjucks from "nunjucks";

nunjucks.configure("src");

export default function render(template, params, componentClass = null) {
  const $template = document.createElement("template");
  $template.innerHTML = nunjucks
    .renderString(template, params)
    .replace(/^\s*|\s*$/g, "")
    .trim();
  const nNodes = $template.content.childNodes.length;
  if (nNodes !== 1) {
    throw new Error(
      `html parameter must represent a single node; got ${nNodes}. 
Note that leading or trailing spaces around an element in your 
HTML, like " <img/> ", get parsed as text nodes neighbouring 
the element; call .trim() on your input to avoid this.`,
    );
  }
  const $el = $template.content.firstChild;

  if (componentClass) {
    new componentClass($el);
  }

  return $el;
}
