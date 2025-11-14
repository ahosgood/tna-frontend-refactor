import nunjucks from "nunjucks";

export default function renderNunjucksFile(
  file,
  params,
  trimWhitespace = true,
) {
  nunjucks.configure("src");
  // console.log("Rendering Nunjucks file:", file, "with params:", params);
  let result = nunjucks.render(file, params);
  // console.log("Nunjucks render result:", result);
  if (trimWhitespace) {
    result = result
      .replace(/^\s*|\s*$/g, "")
      .trim()
      .replace(/>\n\s*/g, ">")
      .replace(/\n\s*</g, "<");
  }
  return result;
}
