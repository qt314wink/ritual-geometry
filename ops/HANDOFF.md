# Ritual Geometry Handoff: Start Here

**Current operating thesis:** proof-led studio commerce. Build one desirable, inspectable Field Kit offer before expanding into a controller suite, subscription platform, full knowledge-graph service, or engine-runtime product.

## Canonical read order

1. `README.md` — repository boundary and runnable surface.
2. `docs/decision-package.md` — product / physics / fabrication constraints.
3. `docs/source-register.md` — what is source authority versus visual or narrative reference.
4. `ops/2026-09-20-intelligent-design-plan.md` — market, offers, architecture, research, and rationale.
5. `ops/ritual-geometry-work-orders.json` — current machine-readable order, gates, and definitions of done.

## First command

```powershell
node scripts/operating-preflight.mjs
node scripts/project-pulse.mjs
```

These commands are read-only. They identify missing prerequisites, the repository's dirty state, ready work orders, and human review gates. They do not install packages, create accounts, call an API, publish, spend, message, commit, push, or change source truth.

## First necessary reconciliation

The local Proof Rail increment is uncommitted/unpushed. Before treating it as public or starting dependent feature work:

1. inspect the exact Git diff and source fixture hashes;
2. rerun `node apps/atlas/public/fixtures/gcode/generate-examples.mjs`, `node scripts/build-machine-job-fixtures.mjs`, and `node tests/contracts.test.mjs`;
3. commit and push only when the user explicitly authorizes both actions;
4. verify the pushed head and update the receipt.

Also resolve `RG-ARCH-01`: the decision-package release law includes `advisory`, while the active Family and MachineJob schemas omit it and include `withdrawn`. Treat this as a versioned compatibility decision, not a quick schema/UI edit. Until then, retain the safe current wording: `draft` with `static_pass; physical_unrun`.

The next product build after that reconciliation is **RG-01: Field Kit offer and discovery page**. Use the accepted navy / bone / gold / mint renderer language as the v0 visual target. It does **not** need payment, analytics, ad pixels, a database, React, three.js, GraphRAG, Unity, Unreal, or a machine driver. Keep it a local, inspectable conversion prototype with one primary CTA and an honest proof route.

## Work boundaries

- Ritual Geometry owns authored family identity, views, layer roles, visual proof, and draft pack artifacts.
- Omni-Loom is a future downstream consumer of `rg.machine-job.v0`; it owns later process profiles, controller/mill adapters, and physical-release execution.
- `static_pass; physical_unrun` means browser/fixture proof only. It is not a calibration, controller, or physical assembly result.
- An agent may add a candidate insight to the evidence ledger, but may not turn it into a truth claim, release state, external post, ad, or purchase without human review and authorization.

## Definition of a strong next delivery

The next delivery should make a visitor able to answer three questions in under a minute:

1. What is this layered object?
2. What would I receive or request?
3. Why should I trust the boundaries of what it can and cannot do?

If it does not make those answers clearer, it is not RG-01 work.
