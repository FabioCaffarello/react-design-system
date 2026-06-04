import type { Ref, RefCallback } from "react";

/**
 * Compose multiple refs into a single ref callback.
 *
 * Each input ref receives the node when the returned callback is invoked.
 * Callback refs are called with the node; object refs receive it via
 * `.current`; `null`/`undefined` entries are ignored. Designed for the
 * common cloneElement pattern where a parent owns an internal ref to a
 * trigger AND the consumer may have supplied their own ref on that
 * trigger — both need to land on the same node.
 *
 * Under React 19, a consumer's ref attached to `<Child ref={r}/>` flows
 * through `child.props.ref` after cloneElement; pass that into mergeRefs
 * alongside the parent's internal ref.
 */
export function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined>
): RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(node);
      } else {
        // RefObject is invariant on T; the only writable shape we accept
        // is { current: T | null }, which matches both useRef and
        // createRef outputs.
        (ref as { current: T | null }).current = node;
      }
    }
  };
}
