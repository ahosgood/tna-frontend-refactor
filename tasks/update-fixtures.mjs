import { globSync } from "glob";
import fs from "fs";
import nunjucks from "nunjucks";

nunjucks.configure("src");

const componentsDirectory = "nationalarchives/components/";
const componentFixturesFile = "/fixtures.json";
const components = globSync(
  `src/${componentsDirectory}*${componentFixturesFile}`,
).map((componentFixtureFile) =>
  componentFixtureFile
    .replace(new RegExp(`^src/${componentsDirectory}`), "")
    .replace(new RegExp(`${componentFixturesFile}$`), ""),
);
await components.forEach(async (component) => {
    import(`../src/${componentsDirectory}${component}${componentFixturesFile}`, {
      with: { type: "json" },
    }).then((componentFixtures) => {
    const newComponentFixtures = {
      ...componentFixtures.default,
      fixtures: componentFixtures.default.fixtures.map((fixture) => ({
        ...fixture,
        html: nunjucks
          .render(`${componentsDirectory}${component}/template.njk`, {
            params: fixture.options,
          })
          .trim()
          .replace(/>\n\s*/g, ">")
          .replace(/\n\s*</g, "<"),
      })),
    };

    const allFixtureDifferences = newComponentFixtures.fixtures.reduce(
      (differences, fixture) =>
        fixture.html !==
        componentFixtures.default.fixtures.find((f) => f.name === fixture.name)
          ?.html
          ? differences + 1
          : differences,
      0,
    );

    if (allFixtureDifferences) {
      fs.writeFile(
        `src/${componentsDirectory}${component}${componentFixturesFile}`,
        `${JSON.stringify(newComponentFixtures, null, 2).trim()}\n`,
        (err) => {
          if (err) throw err;
          console.log(
            `${allFixtureDifferences} ${component} fixture(s) updated successfully`,
          );
        },
      );
    }
  });
});

const templatesDirectory = "nationalarchives/templates/";
const templateFixturesFile = `../src/${templatesDirectory}fixtures.json`;
await import(templateFixturesFile, {
  with: { type: "json" },
}).then(async (templateFixtures) => {
  const newTemplateFixtures = {
    ...templateFixtures.default,
    fixtures: templateFixtures.default.fixtures.map((fixture) => ({
      ...fixture,
      html: nunjucks
        .render(`${templatesDirectory}${fixture.template}`, fixture.options)
        .trim()
        .replace(/>\n\s*/g, ">")
        .replace(/\n\s*</g, "<"),
    })),
  };
  const allFixtureDifferences = newTemplateFixtures.fixtures.reduce(
    (differences, fixture) =>
      fixture.html !==
      templateFixtures.default.fixtures.find((f) => f.name === fixture.name)
        ?.html
        ? differences + 1
        : differences,
    0,
  );

  if (allFixtureDifferences) {
    fs.writeFile(
      `src/${templateFixturesFile}`,
      `${JSON.stringify(newTemplateFixtures, null, 2).trim()}\n`,
      (err) => {
        if (err) throw err;
        console.log(
          `${allFixtureDifferences} template fixture(s) updated successfully`,
        );
      },
    );
  }
});
