# Omni-Loom Integration Boundary

## Decision

Ritual Geometry is a separate product repository. Omni-Loom is a future consumer of a versioned machine-job handoff, not the container for the Ritual Geometry catalog, views, or browser renderer.

## Ritual Geometry owns

- family identity, versions, and display names;
- coloring, stencil, wayfinder, and stack views;
- authored layer order and layer-specific visual role;
- design-space geometry and a single transform declaration;
- draft GRBL fixture examples plus their live inspection surface.

## Omni-Loom may own later

- controller/mill-specific adapters;
- dated material and process profiles;
- backend-neutral constraint evaluation and violations;
- loom structure, take-up, yarn, shaft, and Jacquard information;
- physical release evidence and final machine artifacts.

## Handoff law

Only the `rg.machine-job.v0` contract may cross this boundary. A receiver must reject a job when:

1. its coordinate transform is missing;
2. its release state or evidence state is absent;
3. its source hash does not match the referenced source file;
4. a required material/profile reference is missing for a release execution request; or
5. an adapter would make an undocumented path, unit, or machine change.

## Promotion triggers

Extract or publish the contract only after all of the following are true:

1. a second product needs the same contract;
2. both products have a named owner and release process;
3. at least one real machine/backend consumer has reviewed the fields; and
4. a compatibility policy, fixture corpus, and migration plan exist.

Before then, keep the contract in this repository and treat it as a local draft interface.
