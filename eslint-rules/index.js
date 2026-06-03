import noRawColorClasses from "./no-raw-color-classes/rule.js";
import noRawRadiusClasses from "./no-raw-radius-classes/rule.js";
import noRawShadowClasses from "./no-raw-shadow-classes/rule.js";
import noRawSpacingClasses from "./no-raw-spacing-classes/rule.js";
import storyDiscipline from "./story-discipline/rule.js";

export default {
  meta: {
    name: "eslint-plugin-ds-tokens",
    version: "0.3.0",
  },
  rules: {
    "no-raw-color-classes": noRawColorClasses,
    "no-raw-radius-classes": noRawRadiusClasses,
    "no-raw-shadow-classes": noRawShadowClasses,
    "no-raw-spacing-classes": noRawSpacingClasses,
    "story-discipline": storyDiscipline,
  },
};
