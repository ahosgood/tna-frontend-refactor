import { globSync } from "glob";
import { Diff } from "diff";
import { pass, fail } from "./lib/passfail.mjs";
import renderNunjucksFile from "./lib/nunjucks.mjs";

const componentsDirectory = "src/nationalarchives/components/";
const componentFixturesFile = "/fixtures.json";

const components = globSync(`${componentsDirectory}*${componentFixturesFile}`)
  .map((componentFixtureFile) =>
    componentFixtureFile
      .replace(new RegExp(`^${componentsDirectory}`), "")
      .replace(new RegExp(`${componentFixturesFile}$`), ""),
  )
  .reverse();

const failedComponents = await components.filter(async (component) => {
  console.log(`\nComponent: ${component}`);
  console.log(`../${componentsDirectory}${component}${componentFixturesFile}`);
  return await import(
    `../${componentsDirectory}${component}${componentFixturesFile}`,
    {
      with: { type: "json" },
    }
  ).then((componentFixtures) => {
    console.log(`Loaded fixtures for component: ${component}`);
    console.log(componentFixtures);
    const failedFixtures = componentFixtures.fixtures.filter((fixture) => {
      const result = renderNunjucksFile(
        `${componentsDirectory}${component}/template.njk`,
        {
          params: fixture.options,
        },
      );
      console.log("Rendered HTML:", result);
      const mismatch = result !== fixture.html;
      if (mismatch) {
        fail(
          `${fixture.name} (${componentsDirectory}${component}/template.njk)`,
        );
        console.log("\n");
        const diff = Diff.diffChars(fixture.html, result)
          .map(
            (part) =>
              `${
                part.added ? "\x1b[32m" : part.removed ? "\x1b[31m" : "\x1b[0m"
              }${part.value}`,
          )
          .join("");
        console.log(diff.replace(/></g, ">\n<"));
        console.log("\n");
        return true;
      }
      pass(fixture.name);
      return false;
    });
    return failedFixtures.length;
  });
});
console.log(failedComponents);
console.log("\n------------------------------------------");
if (failedComponents.length) {
  fail(
    `${failedComponents.length} out of ${components.length} component${
      components.length === 1 ? "" : "s"
    } failed`,
  );
  process.exitCode = 1;
  throw new Error("Fixtures tests failed");
} else {
  pass(
    `${components.length} component${
      components.length === 1 ? "" : "s"
    } passed successfully`,
  );
}
console.log("------------------------------------------");

console.log("Templates");
const templatesDirectory = "src/nationalarchives/templates/";
const templateFixturesFile = `${templatesDirectory}fixtures.json`;
const templateFixtures = require(`../${templateFixturesFile}`);
const failedTemplates = templateFixtures.fixtures.filter((fixture) => {
  const templateNunjucks = require(
    `../${templatesDirectory}${fixture.template}`,
  );
  const result = renderNunjucksFile(templateNunjucks, fixture.options, true);
  const mismatch = result !== fixture.html;
  if (mismatch) {
    fail(`${fixture.name} (${fixture.template})`);
    console.log("\n");
    const diff = Diff.diffChars(fixture.html, result)
      .map(
        (part) =>
          `${
            part.added ? "\x1b[32m" : part.removed ? "\x1b[31m" : "\x1b[0m"
          }${part.value}`,
      )
      .join("");
    console.log(diff.replace(/></g, ">\n<"));
    console.log("\n");
    return true;
  }
  pass(fixture.name);
  return false;
});
console.log("\n------------------------------------------");
if (failedTemplates.length) {
  fail(
    `${failedTemplates.length} out of ${templateFixtures.fixtures.length} template${
      templateFixtures.fixtures.length === 1 ? "" : "s"
    } failed`,
  );
  process.exitCode = 1;
  throw new Error("Fixtures tests failed");
} else {
  pass(
    `${templateFixtures.fixtures.length} template${
      templateFixtures.fixtures.length === 1 ? "" : "s"
    } passed successfully`,
  );
}
console.log("------------------------------------------");
