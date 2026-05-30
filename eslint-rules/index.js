import noRawColorClasses from "./no-raw-color-classes/rule.js";
import storyDiscipline from "./story-discipline/rule.js";

export default {
  meta: {
    name: "eslint-plugin-ds-color",
    version: "0.1.0",
  },
  rules: {
    "no-raw-color-classes": noRawColorClasses,
    "story-discipline": storyDiscipline,
  },
};
