// troika-three-text publishes .d.ts files under dist/types but sets no "types"
// field and has no "exports" map, so moduleResolution resolves the UMD build
// and finds no types next to it. An ambient module declaration is the fix TS
// itself suggests, and it lives in its own script file on purpose: inside a
// module file (one with a top-level import) TS prefers the resolved JavaScript
// and reports TS7016 anyway.
// Declared for the ESM entry the rig imports; see the note there for why the
// bare specifier is not used.
declare module "troika-three-text/dist/troika-three-text.esm.js" {
  export type TroikaTextProps = {
    font?: string;
    fontSize?: number;
    color?: string;
    anchorX?: "left" | "center" | "right";
    anchorY?: "top" | "middle" | "bottom";
    // A THREE.Vector3 at runtime, inherited from Object3D. The rig positions the
    // label with set(), so the declaration describes that rather than a tuple.
    position: { set(x: number, y: number, z: number): void };
    outlineWidth?: number;
    outlineColor?: string;
    children?: string;
  };
  // The runtime value is a class extending THREE.Mesh. The rig constructs it
  // directly and attaches it with <primitive>, because R3F's class detection
  // tests against its own three copy and troika ships another one, so a JSX
  // usage would be invoked as a function component. Only the members this repo
  // touches are declared. There is no onSync property in 0.52, and sync() takes
  // the completion callback as an argument and returns undefined rather than a
  // promise, both of which the rig had to discover the hard way.
  export class Text {
    constructor(text?: string);
    text: string;
    font?: string;
    fontSize?: number;
    color?: string;
    anchorX?: "left" | "center" | "right";
    anchorY?: "top" | "middle" | "bottom";
    // A THREE.Vector3 at runtime, inherited from Object3D. The rig positions the
    // label with set(), so the declaration describes that rather than a tuple.
    position: { set(x: number, y: number, z: number): void };
    outlineWidth?: number;
    outlineColor?: string;
    sync(callback?: () => void): void;
    dispose(): void;
  }
  export const preloadFont: (options?: unknown) => Promise<void>;
}
