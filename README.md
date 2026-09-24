# Ritual Geometry

Ritual Geometry is the product repository for a family-based visual language that can leave paper honestly: coloring and stencil views, construction wayfinders, registered layer stacks, inspectable draft GCode, and eventually bounded machine exports.

It is deliberately **not** an Omni-Loom subproject. Ritual Geometry owns authored motif meaning and family provenance. Omni-Loom may later consume a stable `MachineJob` contract when it has a real machine workflow and a second consumer for that contract.

## Runnable first slice

The initial application is a dependency-free static atlas plus live GCode renderer:

- `apps/atlas/public/index.html` — product shape, systems, and the revised exploded five-layer concept plate.
- `apps/atlas/public/gcode-renderer.html` — parses, plays, filters, previews, and downloads the actual fixture files; its proof rail loads an exact served MachineJob only when one is registered for the selected program.
- `apps/atlas/public/fixtures/gcode/` — three draft GRBL 1.1 layer-stack fixtures, their SVG previews, generator, manifest, and hashes.
- `apps/atlas/public/fixtures/machine-jobs/` — browser-served copies and index generated from the canonical `examples/*.machine-job.json` handoffs. Quiet Bloom is presently the sole registered proof-rail fixture.

Run locally with Node.js 20+:

```powershell
node scripts/serve.mjs
```

Open `http://localhost:4173/`. The server root is intentionally limited to `apps/atlas/public`.

## Repository boundary

```text
Ritual Geometry
  family-schema       authored family identity, views, stack intent
  geometry-kernel     coordinate and path invariants
  atlas-and-studio    human-facing authored experience
  MachineJob export   versioned handoff, still draft and evidence-labelled
             |
             v
Omni-Loom (later consumer)
  constraint engine, dated process profiles, machine adapters,
  loom-specific data, and release-grade backend artifacts
```

`packages/machine-job-contract/` is the deliberately small handoff seam. It must remain product-neutral: no Ritual Geometry display copy, no brand art, no controller secret, and no claim of physical validation.

## Operating plan and agent handoff

The durable commercial, technical, and evidence-led work order lives in [the intelligent design plan](ops/2026-09-20-intelligent-design-plan.md). A concise continuation guide is in [the handoff](ops/HANDOFF.md), and machine-readable scope/gates/definitions of done are in [`ops/ritual-geometry-work-orders.json`](ops/ritual-geometry-work-orders.json).

Run the read-only readiness report before starting a work order:

```powershell
node scripts/operating-preflight.mjs
node scripts/project-pulse.mjs
```

## Verification

```powershell
node apps/atlas/public/fixtures/gcode/generate-examples.mjs
node scripts/build-machine-job-fixtures.mjs
node tests/contracts.test.mjs
```

The fixtures validate static structure only. Their current status is `static_pass; physical_unrun`. The proof rail checks schema, family/index agreement, coordinate frame, layer IDs, registration/order, source SHA-256, and the draft boundary against the selected GCode manifest. It does not establish material calibration, controller safety, or successful physical assembly. Programs without a registered MachineJob remain playable and exportable but are explicitly shown as having no contract-to-source proof.

## Extraction rule

Do not extract a shared GCode preview/parser package merely because it looks reusable. Promote it from the atlas only when a second non-Ritual Geometry consumer needs the same reviewed behavior. See [the Omni-Loom integration boundary](docs/omni-loom-integration.md).
