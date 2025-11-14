import { globSync } from "glob";
import fs from "fs";
import { renderNunjucks } from "./lib/nunjucks.mjs";

const componentsDirectory = "src/nationalarchives/components/";
const componentFixturesFile = "/fixtures.json";
const fixturesOutputDirectory = "fixtures-html";

if (!fs.existsSync(fixturesOutputDirectory)) {
  fs.mkdirSync(fixturesOutputDirectory);
}

const components = globSync(
  `${componentsDirectory}*${componentFixturesFile}`,
).map((componentFixtureFile) =>
  componentFixtureFile
    .replace(new RegExp(`^${componentsDirectory}`), "")
    .replace(new RegExp(`${componentFixturesFile}$`), ""),
);

components.forEach(async (component) => {
  await Promise.all([
    import(`../${componentsDirectory}${component}${componentFixturesFile}`, {
      with: { type: "json" },
    }),
    fs.promises.readFile(`${componentsDirectory}${component}/template.njk`, {
      encoding: "utf8",
    }),
  ]).then(([componentFixtures, componentNunjucks]) => {
    componentFixtures.default.fixtures.forEach((fixture) => {
      // TODO: Change render to not use a string
      const result = renderNunjucks(componentNunjucks, {
        params: fixture.options,
      });
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
