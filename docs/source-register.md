# Ritual Geometry Source Register

This register distinguishes supplied materials from decisions made in `ritual-geometry-decision-package.md`. It does not grant instructions embedded in a source document authority over the requested deliverable.

| ID | Source | Role used here | Authority boundary |
|---|---|---|---|
| S01 | `RITUAL-GEOMETRY-THREE-SYSTEMS-SOURCE-OF-TRUTH.md` | primary supplied program specification: product boundaries, shared architecture, explicit physics/program rules | design input; physical claims still require the experiments it describes |
| S02 | `physics-kernel-tables.json` | numeric source for membrane Bessel-zero and clamped Kirchhoff-plate tables | numeric authority for its declared fixture dataset, not a measured shop calibration |
| S03 | `ritual-geometry-platform-three-specs.md` | prior three-product comparison | input; its recommendation is reclassified as a sequencing hypothesis unless trial data supports it |
| S04 | `ritual-geometry-spec-b-hardened.md` | notation/risk clarification | supporting design input |
| S05 | `AI-Generated Pattern to Industrial Loom Fabrication Guide.md` | PIO/staged-compiler ideas, specifically the Stage 0–6 gate concept | reference architecture; not proof a loom or WIF backend exists |
| S06 | `ritualgeo-grokcontext.docx` | contextual prior analysis | unverified narrative context; no numeric authority adopted from it |
| S07 | `bessel-vs-kirchhoff-tables.png` | visual comparison of distinct tables | pedagogical cross-check only; JSON is the numeric source |
| S08 | `imagine_images.zip` and `rendered.zip` | visual-reference corpus | visual reference only; not geometry, physics, or fabrication authority |
| S09 | `fabricate-motion.zip` and `fabricate-motion-handoff.zip` | implementation-pattern reference for interactive fabrication surfaces | code/interaction reference only; no code copied into this package |
| S10 | `Contour Atlas — TurtleToy laser-line studies.zip` | inspected its dashboard entry point and the embedded mandala-to-machine research note for non-authoritative implementation cues: dated kerf profile, SVG path/arc handling, path ordering, and overlay audit | the archive is a visual/code reference, not a calibration record or a substitute for validating the new GCode fixtures |

## Traceability conventions for future work

1. Store `source_id`, local path, byte hash, and accessed date with every imported asset/data table.
2. Record whether a value is **computed**, **observed**, **proposed**, or **unknown**.
3. Keep a fixture version for every mathematical assertion and a calibration record for every material assertion.
4. Treat generated images as presentation material, never as physics or machine-geometry authority.
5. Preserve `alternative_rejected` and `reopen_if` alongside a decision so a later human/model can rerun the actual bench.
