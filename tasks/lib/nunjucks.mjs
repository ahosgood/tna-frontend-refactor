import nunjucks from "nunjucks";

nunjucks.configure("src");

const renderNunjucks = (string, params, trimWhitespace = false) =>
  trimWhitespace
    ? nunjucks
        .renderString(string, params)
        .trim()
        .replace(/>\n\s*/g, ">")
        .replace(/\n\s*</g, "<")
    : nunjucks.renderString(string, params);

export { nunjucks, renderNunjucks };
