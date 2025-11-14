import { globSync } from "glob";
import fs from "fs";
import renderNunjucksFile from "./lib/nunjucks.mjs";

const componentsDirectory = "nationalarchives/components/";
const componentFixturesFile = "/fixtures.json";
const fixturesOutputDirectory = "fixtures-html";

if (!fs.existsSync(fixturesOutputDirectory)) {
  fs.mkdirSync(fixturesOutputDirectory);
}

const components = globSync(
  `src/${componentsDirectory}*${componentFixturesFile}`,
).map((componentFixtureFile) =>
  componentFixtureFile
    .replace(new RegExp(`^src/${componentsDirectory}`), "")
    .replace(new RegExp(`${componentFixturesFile}$`), ""),
);

components.forEach(async (component) => {
  import(`../src/${componentsDirectory}${component}${componentFixturesFile}`, {
    with: { type: "json" },
  }).then((componentFixtures) => {
    componentFixtures.default.fixtures.forEach((fixture) => {
      const result = renderNunjucksFile(
        `${componentsDirectory}${component}/template.njk`,
        {
          params: fixture.options,
        },
      );
      fs.writeFile(
        `${fixturesOutputDirectory}/${component}-${fixture.name
          .replace(/[^0-9a-z]/gi, "-")
          .toLowerCase()}.html`,
        result,
        (err) => {
          if (err) {
            return console.log(err);
          }
        },
      );
    });
  });
});
