// Dedicated CSS entry for batteries-included distribution.
// This entry's only job is to side-effect import the global stylesheet
// so Vite library mode emits dist/react-design-system.css with the full
// token cascade. Consumers do NOT import this JS file — they import the
// emitted CSS via the package.json "./styles" export, which points to
// the asset directly. The JS shell that Vite produces for this entry is
// build-time scaffolding only.
import "../style.css";
