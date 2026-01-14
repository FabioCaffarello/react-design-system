export default function plop(/** @type {import("plop").NodePlopAPI} */ plop) {
  plop.setGenerator("ui", {
    description: "Create a new UI component",
    prompts: [
      {
        type: "list",
        name: "type",
        message: "Component type",
        choices: ["atom", "molecule", "organism", "template", "pattern", "layout"],
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
      {
        type: "confirm",
        name: "hasVariants",
        message: "Does this component have variants?",
        default: false,
      },
      {
        type: "input",
        name: "variants",
        message: "Variants (comma-separated, e.g., primary,secondary,outline)",
        when: (answers) => answers.hasVariants,
        default: "primary,secondary",
      },
      {
        type: "confirm",
        name: "hasSizes",
        message: "Does this component have sizes?",
        default: false,
      },
      {
        type: "input",
        name: "sizes",
        message: "Sizes (comma-separated, e.g., sm,md,lg)",
        when: (answers) => answers.hasSizes,
        default: "sm,md,lg",
      },
      {
        type: "confirm",
        name: "hasChildren",
        message: "Does this component accept children?",
        default: true,
      },
      {
        type: "list",
        name: "pattern",
        message: "Design pattern (optional)",
        choices: [
          { name: "None", value: "none" },
          { name: "Factory Pattern", value: "factory" },
          { name: "Builder Pattern", value: "builder" },
          { name: "Strategy Pattern", value: "strategy" },
        ],
        default: "none",
      },
    ],

    actions: (data) => {
      const actions = [
        {
          type: "add",
          path: "./src/ui/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.tsx",
          templateFile: data.type === "atom" 
            ? "./plop-templates/Atom.template.tsx.hbs"
            : "./plop-templates/Component.tsx.hbs",
        },
        {
          type: "add",
          path: "./src/ui/{{type}}s/{{pascalCase name}}/{{pascalCase name}}.stories.tsx",
          templateFile: "./plop-templates/Story.tsx.hbs",
        },
        {
          type: "append",
          path: "./src/ui/{{type}}s/index.ts",
          template:
            'export { default as {{pascalCase name}} } from "./{{pascalCase name}}/{{pascalCase name}}";',
        },
      ];

      // Add factory pattern if selected
      if (data.pattern === "factory") {
        actions.push({
          type: "add",
          path: "./src/ui/{{type}}s/{{pascalCase name}}/{{pascalCase name}}Factory.ts",
          templateFile: "./plop-templates/Factory.template.tsx.hbs",
        });
      }

      return actions;
    },
  });
}
