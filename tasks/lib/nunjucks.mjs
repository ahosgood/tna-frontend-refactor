import nunjucks from "nunjucks";
import path from "path";
import fs from "fs";

// require.extensions[".njk"] = function (module, filename) {
//   module.exports = fs.readFileSync(filename, "utf8");
// };

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
