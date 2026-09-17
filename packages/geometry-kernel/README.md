# Geometry Kernel Boundary

The kernel must hold only reusable geometry facts: paths, units, transforms, radial guides, discrete model bindings, and closure/overlay checks. It must not import UI display copy, browser-player state, controller dialect syntax, or material defaults.

The initial static fixture corpus keeps the coordinate law explicit: design millimetres map to SVG and GCode through one declared 200 × 200 mm lower-left-origin frame. Any future kernel implementation must prove that transform round trip before it can replace the fixture generator.
