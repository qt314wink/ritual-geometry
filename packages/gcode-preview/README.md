# GCode Preview Extraction Gate

The live renderer remains in `apps/atlas/public/gcode-renderer.html` for now because it has one product consumer and it intentionally carries Ritual Geometry layer semantics.

Do not duplicate its parser into a shared package until a second consumer needs the same reviewed command subset and the shared API can be specified with fixtures. At that point, extract parsing only; retain product-specific names, visual roles, and release copy in the consuming application.
