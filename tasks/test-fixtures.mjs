import { globSync } from "glob";
import { diffChars } from "diff";
import { pass, fail } from "./lib/passfail.mjs";
import renderNunjucksFile from "./lib/nunjucks.mjs";

const componentsDirectory = "nationalarchives/components/";
const componentFixturesFile = "/fixtures.json";

const components = globSync(
  `src/${componentsDirectory}*${componentFixturesFile}`,
)
  .map((componentFixtureFile) =>
    componentFixtureFile
      .replace(new RegExp(`^src/${componentsDirectory}`), "")
      .replace(new RegExp(`${componentFixturesFile}$`), ""),
  )
  .reverse();

await Promise.all(
  components
    .map((component) => ({
      component,
      fixturesFile: `../src/${componentsDirectory}${component}${componentFixturesFile}`,
      templateFile: `${componentsDirectory}${component}/template.njk`,
    }))
    .map(async ({ component, fixturesFile, templateFile }) => ({
      templateFile,
      name: component,
      fixtures: await import(fixturesFile, { with: { type: "json" } }).then(
        (module) => module.default.fixtures,
      ),
    })),
).then((results) => {
  const failedComponents = results.filter((component) => {
    console.log(`\nComponent: ${component.name}`);
    const failedFixtures = component.fixtures.filter((fixture) => {
      const result = renderNunjucksFile(component.templateFile, {
        params: fixture.options,
      });
      const mismatch = result !== fixture.html;
      if (mismatch) {
        fail(`${fixture.name} (${component.file})`);
        console.log("\n");
        const diff = diffChars(fixture.html, result)
          .map(
            (part) =>
              `${
                part.added ? "\x1b[32m" : part.removed ? "\x1b[31m" : "\x1b[0m"
              }${part.value}`,
          )
          .join("");
        console.log(diff.replace(/></g, ">\n<"));
        console.log("\n");
      } else {
        pass(fixture.name);
      }
      return mismatch;
    });
    return failedFixtures.length > 0;
  });

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
});

console.log("------------------------------------------");
console.log("\n");
const templatesDirectory = "src/nationalarchives/templates/";
const templateFixturesFile = `${templatesDirectory}fixtures.json`;
await import(`../${templateFixturesFile}`, { with: { type: "json" } }).then(
  (module) => {
    console.log("Templates");
    const templateFixtures = module.default;
    const failedTemplates = templateFixtures.fixtures.filter((fixture) => {
      const result = renderNunjucksFile(
        `../${templatesDirectory}${fixture.template}`,
        fixture.options,
        true,
      );
      const mismatch = result !== fixture.html;
      if (mismatch) {
        fail(`${fixture.name} (${fixture.template})`);
        console.log("\n");
        const diff = diffChars(fixture.html, result)
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
  },
);
