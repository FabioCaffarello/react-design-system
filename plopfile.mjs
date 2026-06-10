export default function plop(/** @type {import("plop").NodePlopAPI} */ plop) {
  plop.setGenerator("ui", {
    description:
      "Create a new UI component — emits the full five-file set required by scripts/validate-file-set.mjs",
    prompts: [
      {
        type: "list",
        name: "type",
        message: "Component type",
        choices: ["primitive", "component", "layout"],
      },
      {
        type: "input",
        name: "name",
        message: "Component name (PascalCase)",
        validate: (input) => {
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return "Component name must be PascalCase (e.g., Button, Card)";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "Component description",
        default: "A new component",
      },
    ],

    actions: () => [
      {
        type: "add",
        path: "./src/ui/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "./plop-templates/Component.tsx.hbs",
      },
      {
        type: "add",
        path: "./src/ui/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.test.tsx",
        templateFile: "./plop-templates/Test.tsx.hbs",
      },
      {
        type: "add",
        path: "./src/ui/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.accessibility.test.tsx",
        templateFile: "./plop-templates/AccessibilityTest.tsx.hbs",
      },
      {
        type: "add",
        path: "./src/ui/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.stories.tsx",
        templateFile: "./plop-templates/Story.tsx.hbs",
      },
      {
        type: "add",
        path: "./src/ui/{{type}}s/{{pascalCase name}}/index.ts",
        templateFile: "./plop-templates/index.ts.hbs",
      },
      {
        type: "append",
        path: "./src/ui/{{type}}s/index.ts",
        template:
          'export { default as {{pascalCase name}} } from "./{{pascalCase name}}";\nexport type { {{pascalCase name}}Props } from "./{{pascalCase name}}";',
      },
    ],
  });
}
