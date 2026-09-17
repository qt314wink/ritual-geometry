# Ritual Geometry: Three-System Build Decision Package

**Package ID:** `RG-ATLAS-2026-09-14`
**Status:** proposed build plan; no physical validation has yet been supplied
**Purpose:** preserve a buildable rationale for all three products, including the conditions that could change sequencing. This is a design and engineering proposal, not evidence that an export, cut, classroom session, or loom operation has succeeded.

## Executive outcome

Build **three independently shippable surfaces over one shared truth layer**. Do not force a single winner before trials. The practical operating order is **shared foundation → A evidence slice → B family/pack capabilities → C laser gate → C loom backend only when loom inputs exist**. That order is a falsifiable sequence, not a claim that A or C are inferior.

| Surface | Product | Root object | First user outcome | Scope boundary |
|---|---|---|---|---|
| A | **Wayfinder Studio** | named motif view | print or test-cut one honest design | no layer planner, no Hz authoring, no PIO |
| B | **Ritual Geometry OS** | motif family | make, revise, and release a related pack/stack | no direct machine emission without constraint service |
| C | **Latticeworks** | fabrication job | identify whether a job is safe to emit | no WIF/Jacquard promise without machine/yarn/hook data |

The common product law is: **a model can propose intent; only a validated emitter can produce a machine artifact.** The common release law is `draft → advisory → release`; only `release` can leave the shop.

## Evidence boundary and physics lock

`physics-kernel-tables.json` is the supplied numeric authority. Its membrane and clamped-plate values must remain separate.

| Topic | Locked distinction | Consequence in product |
|---|---|---|
| Circular membrane | `j[m,n]` is a Bessel zero; `m` is nodal-diameter count and `n` is radial-zero index | default `membrane_clamped` ModeField uses discrete `(m,n)` chips, not an interpolating Hz slider |
| Membrane fixture | `(0,2)` has an interior node at `r/a = 0.435650` | unit fixture must hold within `±0.0005` before kerf/offset operations |
| Clamped Kirchhoff plate | `Ω=(ka)²` is a different eigenvalue table, with radial functions combining `Jm` and `Im` | never reuse membrane zero ratios as plate-node radii; expose `plate_kirchhoff_clamped` as a named model |
| Free plate / Faraday vessel | different boundary condition or physical system | remain separately labeled and unavailable for fictional frequency claims until a declared rig is measured |
| Phyllotaxis | `alpha = 360°/φ²`, retained at full precision | data stores `alpha_id`; a cuttable lattice derives connected modules rather than turning points into isolated dots |

**Claims deliberately not made:** no calibrated kerf value, no measured overlay residual, no verified LightBurn import, no physical Chladni correspondence, no pack identity score, and no loom capability are asserted by this package.

## Shared component architecture

```text
family-schema
  ├── geom-kernel
  │     ├── PathOps          close | flatten | offset | rebridge
  │     ├── RadialGuide      6/8/12/24 and mode-m divisions
  │     ├── ModeField        discrete membrane/plate models
  │     └── Phyllotaxis      Vogel centers + cuttable connected modules
  ├── constraint-core
  │     ├── KerfProfile      material × thickness × settings × date
  │     ├── FeatureRules     bridges, islands, path closure
  │     ├── OverlayAudit     one transform, residual in mm
  │     └── Violation[]      id | rule_id | severity | remediation
  ├── pack-assembler         PDF | SVG | sidecar export receipt
  └── machine-backends       GRBL GCode now | PIO/WIF later
          ▲                       ▲                     ▲
          A                       B                     C
```

### Contract fragments

```ts
type ReleaseState = "draft" | "advisory" | "release";
type Violation = {
  id: string; rule_id: string;
  severity: "blocking" | "advisory";
  region_id?: string; remediation: string;
};
type KerfProfile = {
  id: string; material: string; thickness_mm: number;
  machine_settings_ref: string; calibrated_at: string;
};
type ExportReceipt = {
  family_id: string; profile_id: string; transform_id: string;
  overlay_residual_mm: number | null; release_state: ReleaseState;
};
```

`transform_id` must identify the same mapping used in preview pixels, SVG units, and GCode millimetres. The acceptance budget is `< 0.2 mm` at 1:1; a missing measurement is **unknown**, not a pass.

## System design specifications

### A — Wayfinder Studio

**Promise:** From one named motif to a clear paper artifact or first cardboard cut within one sitting.

**Primary profiles:** a teacher with 40 minutes; a first laser owner; a person who wants a printable page without an account or community layer.

| Surface / component | Input | Output | Interaction rule |
|---|---|---|---|
| Motif rail | family view / imported SVG in a named slot | selected working view | orphan files cannot be exported as catalog artifacts |
| Paper canvas | Letter or A4, coloring/stencil, guide selection | on-page proof | 0.5 in safe margin is visible before print |
| Inspector | dated kerf profile; `Off/12-seg/mode-m` guide | resolved derivation parameters | profile displays date; no naked kerf number |
| Honesty status | PathOps and OverlayAudit result | closure count and residual | a fail state is visible before Export |
| Export sheet | PDF / SVG / optional GCode request | export plus receipt | every artifact receives `family_id`, `profile_id`, `transform_id` |

**UX paths:**

1. *Print tonight:* choose Quiet Bloom → Coloring → Letter → PDF → print.
2. *First cut:* choose Quiet Bloom → Stencil → select a dated material profile → SVG → cardboard corner test.
3. *Truth check:* enable overlay → emit GCode → inspect residual; release remains disabled if any blocking rule fails.

**Definition of done:** closed SVG paths; letter/A4 page boxes with 0.5 in margin; dated profile required; receipt emitted; transform audit `<0.2 mm`; time-to-first-print `<15 min` in an observed A-U3 session. A does not claim a layer stack, physics authorship, or loom compilation.

### B — Ritual Geometry OS

**Promise:** A family remains recognizable while it becomes a coloring page, stencil, guide, remix, or registered stack.

**Primary profiles:** studio maker; workshop/curriculum lead; family author.

| Surface / component | Input | Output | Interaction rule |
|---|---|---|---|
| Family rail | `family_id`, version, view records | a navigable family tree | a stencil identifies `derived_from` instead of becoming a new file |
| Workbench | master paths, guide/mode data | coloring, stencil, wayfinder views | visual suffix and lineage travel with the family |
| Layer planner | 3/5/7 layers, material profile, outer frame | registration-aware layer set | inward offsets are re-bridged; screen alignment alone is insufficient |
| ModeField | named model and discrete `(m,n)` chips | measured geometry guide | membrane and plate choices cannot share the same node routine |
| Remix deck | a defined operator and prior lineage | changed family revision | protected zero tables and alpha stay unchanged unless the operator explicitly declares that change |
| QA desk | swatch, violations, overlay, release evidence | release decision and pack receipt | no honor-system machine export |

**UX paths:**

1. *Workshop pack:* open Quiet Bloom → choose print/cut trio → assemble PDF/SVG/checklist → run cardboard test.
2. *Registered stack:* select five layers → resolve profile → inspect bridges → cut cardboard → record measured registration → request release.
3. *Frequency Bloom:* select `membrane_clamped` → choose discrete sequence → verify `(0,2)` node location → derive a cuttable stencil.
4. *Remix:* apply `widen_silence` → view before/after → see immutable provenance and test family identity.

**Definition of done:** three families with coloring/stencil/wayfinder views; one 5- or 7-layer cardboard release; `(0,2)` fixture pass; golden-angle packing-gap result at `N=200`; blind identity test; pack receipt. Until those are collected, the OS is `draft`/`advisory`, not confirmed as a craft loop.

### C — Latticeworks

**Promise:** Turn an explicit fabrication job into a visible, staged validation result; block emit rather than silently repair a dangerous or invalid job.

**Primary profiles:** laser technician; textile researcher; platform engineer.

| Stage | Laser behavior now | Loom behavior later | Exit evidence |
|---|---|---|---|
| 0 — ingest | normalize a B family pack / SVG | accept PIO JSON | source receipt and input schema pass |
| 1 — structural validation | closed paths, schema fields, source integrity | PIO structural fields | machine-readable `Violation[]` |
| 2 — resolution | resolve paths + profile | resolve weave structure | resolved model is visible; never silently substituted |
| 3 — geometry reconciliation | kerf, bridges, islands, bounds | aspect/take-up/repeat | 1:1 preview and changed regions |
| 4 — binding | material/profile binding | palette-to-yarn binding | dated/material references present |
| 5 — emit | SVG/GCode | WIF/bitmap/Jacquard dialect | disabled if blockers remain |
| 6 — simulation QA | toolpath overlay audit | drawdown QA | stage receipt and explicit pass/fail |

**Definition of done, laser-first:** a deliberately bad `0.3 mm` bridge raises a `blocking` violation and cannot emit; valid inputs retain a 1:1 coordinate audit; the report names all advisory changes. **Not in initial implementation:** PIO-to-WIF production operation, yarn-lot binding, machine-hook/shaft compatibility, and Jacquard emission.

## Bounded build orders and stop criteria

Build items are packages with an exit test and a condition that stops expansion. A failure triggers repair/research, not feature accumulation.

| Order | Package | Exit test | Stop / kill condition |
|---|---|---|---|
| F0 | Foundation: schemas, transform law, violation shape, release state | example records validate; one coordinate transform is referenced by preview/export | separate transforms or missing provenance fields |
| A1 | A canvas and static Quiet Bloom | PDF has margins and static view opens | page density defeats coloring task |
| A2 | A SVG + receipt | closed-path fixture; receipt includes profile/date/transform | preview file differs or profile is undated |
| A3 | A stencil deriver | worst bridge passes cardboard test | tiny islands or photo-shrink derivation |
| B1 | B family catalog + three views | source/derived relation and suffix survive navigation | orphan images can enter the catalog |
| B2 | B layer planner | 3/5/7-layer cardboard registers within stated target | only visual alignment exists |
| B3 | B ModeField and Phyllotaxis | `(0,2)` radius fixture; N=200 comparison receipt | Hz interpolates membrane geometry or alpha is rounded |
| B4 | B remix + QA desk | immutable lineage and release gate demonstrated | manual release bypass / unlogged changes |
| C1 | C laser stage machine | bad-bridge fixture blocks Stage 5 | advisory/bypass emission is possible |
| C2 | C pack ingestion | B export enters C without retyping or coordinate drift | compiler forks family geometry |
| C3 | C loom discovery boundary | named mill supplies yarn and hook/shaft inputs; PIO sample validates | no production WIF/Jacquard work before equipment evidence |

## Dependency and framework decision

| Layer | Proposed technology | Reason | Explicit non-claim |
|---|---|---|---|
| Client | Next.js + TypeScript | stable UI shell and route-level products | framework does not validate geometry |
| Geometry | Paper.js or a tested path library; dedicated PathOps wrappers | curve/path work and controlled flattening | default library tolerances are not an export guarantee |
| Schema | Zod + JSON Schema | front-end ergonomics plus exchange validation | schema pass is not fabrication pass |
| State/data | versioned JSON records first; PostgreSQL only when collaboration needs it | portable evidence and small-team start | database presence does not create a catalog practice |
| PDF/SVG | PDFKit (or tested equivalent) + controlled SVG emitter | page-box and sidecar export contracts | image conversion is not a stencil deriver |
| GCode | GRBL adapter behind machine-backend interface | keeps source paths distinct from emitted toolpath | emitted code requires real machine/profile validation |
| Test/QA | Vitest + Playwright + fixture corpus | deterministic contracts and visual flows | green tests do not prove physical output |

## Design system: marks, thumbnails, and motion

### Shared visual law

- **Mark construction:** three concentric rings around a precise center point; one clipped gap changes per product. It denotes a common coordinate language, not spirituality.
- **A mark:** open copper arc on paper — “a path you can begin.”
- **B mark:** five nested indigo rings with a registration notch — “a family of views.”
- **C mark:** graphite target/grid with a vermilion constraint cut — “a job is gated.”
- **Palette:** bone `#F5F0E6`, graphite `#252729`, indigo `#28305C`, copper `#A55B3D`, vermilion `#C54232`, status green `#2F7052`. Vermilion is reserved for blockers, not aesthetic emphasis.
- **Type:** a compact grotesk for control/data and a restrained serif for explanatory reading. No faux-sacred glyphs, occult language, or claims of physical effects.

### Thumbnail system

Every family thumbnail is a 1:1 crop with: (1) black/indigo line geometry, (2) a 12% tonal material cue only when relevant, (3) a lower-left view-class tab, (4) a release-state dot, and (5) no fabricated frequency label. Keep imagery as a discovery cue; the family ID and model tag remain real text in the accessible UI.

### Motion contract

| Motion | Purpose | Duration | Reduced-motion behavior |
|---|---|---:|---|
| Exploded stack settles on frame | teach registration relationship | 420 ms | immediate before/after + numeric gap |
| Remix before/after sweep | show a declared operator changed geometry | 260 ms | crossfade disabled; two static canvases |
| Toolpath overlay trace | expose coordinate truth | user-controlled | static overlay + residual value |

No motion may imply vibration or physical simulation unless its named model, inputs, and evidence state are visible.

## Layer-stack rule and executable toolpath fixtures

### Stack composition rule

An exploded stack must show **one distinct interior geometry per layer**, not copies of a single motif floating at different heights. The invariant across a stack is the shared registration frame, the registration-hole coordinates, the origin, and the installation order. The variation is the geometry each layer contributes to the assembled relief.

Quiet Bloom’s five-layer proof composition is therefore:

| Sequence | Layer ID | Distinct contribution | Shared invariant |
|---:|---|---|---|
| 01 | `L01_BASE` | twelve aperture lozenges | 160 mm circular perimeter and four registration holes |
| 02 | `L02_CROWN` | six broad petal windows | same perimeter and pin geometry |
| 03 | `L03_LATTICE` | twelve-point star window | same perimeter and pin geometry |
| 04 | `L04_VESICA` | four diagonal vesica windows | same perimeter and pin geometry |
| 05 | `L05_CORE` | eight-petal core + centre aperture | same perimeter and pin geometry |

This makes the exploded view explanatory: moving the layers vertically reveals a construction sequence rather than an arbitrary animation. The OS mockup now represents those five independent cut layers.

### Three deterministic GRBL example programs

[`ritual-geometry-gcode-examples/`](./ritual-geometry-gcode-examples/) contains three generated programs and matching SVG previews:

1. `quiet-bloom-5-layer-stack.gcode` — five `M0`-separated layers, corresponding to the composition above.
2. `frequency-bloom-7-layer-stack.gcode` — seven discrete-mode-informed layers. Its `(0,2)` / `(0,3)` guide rings use the supplied membrane ratios; it does not claim that a wood stack is a measured vibrating membrane.
3. `leaf-spiral-5-layer-stack.gcode` — five changing phyllotaxis module fields, retaining full-precision `alpha = 360°/φ²` in the source generator.

Every program is generated from the same ordered shape records as its preview SVG, then statically checked for: `G21`, `G90`, `G17`, `G94`, laser-off `M5` preamble and end, `M0` count matching the number of passes, `M2` end, and XY coordinates inside a 200 × 200 mm pinned jig. Each pass is ordered as **registration holes → that layer’s unique interior geometry → shared outer perimeter last**.

The programs are controller-readable GRBL 1.1 laser-mode examples but remain `draft` rather than `release`. Machine-specific kerf, material, focus, air assist, power, feed, origin, overlay, and physical-cut evidence are unavailable. `S350` and `F1200` in the fixtures are deliberately illustrative—not an approved material recipe. A release copy requires the run gate and evidence record described in the fixture README.

## Ten-lens review protocol

Each lens writes one question, one non-negotiable constraint, one failure mode, and one decision. The protocol is a review method, not a source of truth.

| Lens | Decision right | Hard constraint | Typical veto |
|---|---|---|---|
| Engineer | coordinate/export validity | preview and emitter use one transform | visual/file mismatch |
| Systems architect | bounded-context seams | remix cannot mutate GCode | product becomes a god object |
| Feedback-loop analyst | real-world agency metric | a loop ends in a physical/reusable artifact | infinite generation replaces practice |
| Compassionate communicator | user-facing explanation | language makes an attainable week clear | identity/status pressure masquerades as help |
| Innovative inventor | pilot design | every pilot has a kill criterion | slideware claims |
| Visual architect | motion/visual teaching | animation must reveal a relationship | decorative mystification |
| Fabrication constraint officer | physical safety/reliability | constraints block, not whisper | fragile bridge/island ships |
| Catalog librarian | identity/version integrity | assets carry family + lineage | orphan or drifting identities |
| Agency curriculum designer | learning flow | a reversible cheap mistake is available | consumption substitutes for craft |
| Epistemic QA auditor | claim/evidence labeling | missing evidence remains unknown | metaphor is labeled as physics |

**Tie breaks:** Constraint Officer can block emission; QA Auditor can block an unsupported physical claim; Librarian owns identifiers and versioning; Communicator owns user-facing wording; Inventor cannot override a safety or evidence veto with a deadline.

## Signal-validation plan

| ID | Question | Method | Passing evidence | Decision reopened |
|---|---|---|---|---|
| E1 | Is preview/export honest? | cut and measure a 1 in square with documented profile | residual within 0.2 mm | transform law / A+C readiness |
| E2 | Does a stencil retain family identity? | blinded naming exercise | predefined recognition threshold met | D1 family-root claim |
| E3 | Is ModeField geometry correct? | print/raster measure `(0,2)` and `(0,3)` guide radii | values within stated fixture tolerance | membrane implementation |
| E4 | Which physical model applies to a named rig? | photograph a controlled Chladni/plate run, document boundary/material | declared model matches measured nodes | plate/free/Faraday availability |
| E5 | Is golden angle retained correctly? | packing-gap comparison at N=200 | full-precision golden result beats documented alternatives | lattice kernel choice |
| E6 | Does the product produce practice? | two-week use diary: prints, test cuts, stacks, unused exports | predeclared metric trend | A/B sequencing hypothesis |
| E7 | Does the compiler truly gate? | inject 0.3 mm bridge into fixture job | blocking violation disables Stage 5 | C stage machine |
| E8 | Is loom work ready? | collect real mill machine + material inputs and PIO examples | complete readiness record | C loom backend start |

## Acceptance suite

**Unit:** `ModeField(0,2)` node-radius fixture; Bessel/plate table type separation; path closure; no open subpaths; transform round-trip; required kerf calibration date; golden-angle full-precision record; violation serialization.

**Integration:** B pack → C ingest retains `family_id` and `transform_id`; SVG→GCode overlay fixture; stencil derivation honors minimum bridge; Stage 6 blocks Stage 5; release receipt cannot be produced from incomplete evidence.

**Browser/accessibility:** keyboard-reachable family rail, layer controls, status panel, export control; meaningful model/physics labels in the accessibility tree; reduced-motion alternatives; color is never the only blocking indicator; page/document titles distinguish A/B/C.

**Physical/manual:** print margin; cardboard lift; 1 in square measurement; layer registration; proof photo plus profile and material note. These manual tests remain **unrun** until a person records them.

## Preserved assumptions and reopen rule

The source material supports three distinct jobs and a shared architecture. It does **not** yet supply trials that prove the recommended sequencing. Therefore the implementation should preserve the decision register, source file hash/path, data/fixture revision, run date, tester, machine/material context, observed result, and `reopen_if` condition for every materially consequential claim.

The next responsible action is F0 then A1–A3, while B and C contracts are implemented as shared packages rather than abandoned designs. Bench or expand a product only after E1–E8 produce evidence; do not decide by narrative momentum.
