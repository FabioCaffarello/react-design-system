export { default } from "./Input";
export type { InputProps, InputSize, InputVariant, InputState } from "./Input";

// Server-safe presentational core (issue #224). Importable from the
// `./server` entry; the interactive `Input` above composes it.
export { default as InputBase } from "./InputBase";
export type { InputBaseProps } from "./InputBase";
