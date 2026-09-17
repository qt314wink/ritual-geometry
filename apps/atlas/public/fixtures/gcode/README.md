# Ritual Geometry — Choreographed Layer-Stack GCode Fixtures

This folder contains three reproducible **GRBL 1.1 laser-mode (`M4`) examples**. Each one has a matching SVG preview generated from the same sequence of shape records as its GCode; the preview is not an independently drawn stand-in.

| Example | Intended assembled result | Passes | Files |
|---|---|---:|---|
| Quiet Bloom | a 5-layer mandala made from aperture lattice, crown, star, vesica windows, and core rosette | 5 | `quiet-bloom-5-layer-stack.gcode`, preview SVG |
| Frequency Bloom | a 7-layer discrete-mode-informed composition, with actual supplied `(0,2)` / `(0,3)` guide radii where stated | 7 | `frequency-bloom-7-layer-stack.gcode`, preview SVG |
| Leaf Spiral | a 5-layer phyllotaxis composition with changing module forms and density | 5 | `leaf-spiral-5-layer-stack.gcode`, preview SVG |

## Important state: real syntax, draft fabrication status

The `.gcode` files are ordinary controller-readable examples for a **GRBL 1.1 laser-mode controller**: they use millimetres (`G21`), absolute coordinates (`G90`), `M4` dynamic laser mode, `M5` laser off, `M0` layer-change pauses, and `M2` program end. They do **not** home the machine or select a work offset. Every generated coordinate endpoint lies within a 200 × 200 mm jig.

They are nevertheless `draft`, not `release`, because no particular machine, lens, material, stock thickness, power, speed, focus, air assist, origin method, kerf, or physical overlay measurement has been supplied or run. The `S350` and `F1200` values are intentionally illustrative emission settings, **not a recommended recipe**.

## Choreography contract

Each `M0` introduces one physical layer. Before resuming, the operator loads the named sheet against the same four registration pins at `(28,100)`, `(100,28)`, `(172,100)`, and `(100,172)` mm. In every pass, the order is fixed:

1. cut four registration holes;
2. cut that pass’s distinct interior geometry;
3. cut the shared outer perimeter last;
4. `M5` laser off, then pause for the next sheet.

The final image is produced by stacking the separated sheets on the common pins in `PASS 01 → PASS N` order and fastening them with an appropriate mechanical/adhesive assembly method. A laser does not itself fuse plywood/acrylic layers; the word *fused* in product copy should mean the assembled relief, not thermal welding.

## Run gate — required before any machine execution

1. Confirm the controller is GRBL 1.1-compatible and that `M4` behaves as expected; otherwise use a deliberate backend adapter, not a global find/replace.
2. Bind a dated `KerfProfile` containing material, thickness, machine settings, focus/air conditions, and calibration method.
3. Load a sacrificial material piece in a fixed 200 × 200 mm jig and run a dry/laser-disabled boundary check first.
4. Test a 1 in / 25.4 mm square and registration holes; record measured residual against the 0.2 mm acceptance budget.
5. Simulate/preview the actual controller program, then run one layer at a time with supervision.
6. Record the job, material, profile revision, preview/GCode hash, results, and violations. Only a successful evidence record can promote a copy of a fixture to `release`.

## Integrity checks

`generate-examples.mjs` is the source emitter. Rerun it with Node.js from this directory to regenerate GCode, SVG previews, and `gcode-pass-manifest.json`. The manifest stores SHA-256 digests and validates static controller structure; its status is `static_pass; physical_unrun`.

## Local live renderer

`../ritual-geometry-gcode-renderer.html` is the browser-facing inspection surface for these exact fixtures. When served over HTTP, it fetches `gcode-pass-manifest.json` and the selected `.gcode` file at runtime, then renders the original ordered `G0`/`G1`/`G2`/`G3` moves. It supports all-program playback, pass isolation, stepping, matched-SVG opening, and direct download of the selected source `.gcode` file. It does not send commands to a controller or turn the browser preview into fabrication evidence.

The `Frequency Bloom` layer labels are discrete model bindings. They do not claim that a cut wood stack is a measured vibrating membrane or plate. The `(0,2)` and `(0,3)` rings use values from the supplied membrane table; clamped-plate values and node radii remain a separate model.
