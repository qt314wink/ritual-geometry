/**
 * Ritual Geometry example emitter
 *
 * Emits three controller-readable GRBL 1.1 laser-mode examples and matching
 * SVG previews from the same ordered geometry. This is a reproducible fixture,
 * not a machine release: power, feed, kerf offset, material and jig have not
 * been calibrated in this workspace.
 *
 * Run: node generate-examples.mjs
 */
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const C = { x: 100, y: 100 };
const FRAME_R = 80;
const REG_R = 72;
const PROFILE = {
  controller: 'GRBL 1.1 laser mode (M4 dynamic power)',
  coordinate_system: 'millimetres; absolute; 200 × 200 mm jig; origin at lower-left',
  feed_mm_min: 1200,
  power_s: 350,
  material_profile: null,
  release_state: 'draft'
};
const palette = ['#D76549', '#B98B2D', '#54789C', '#4A755E', '#7D5B8E', '#92565C', '#346B68'];
const f = n => Number(n.toFixed(3)).toString();
const p = (x, y) => ({ x: +x.toFixed(3), y: +y.toFixed(3) });
const rad = d => d * Math.PI / 180;
const rot = (x, y, d) => p(x * Math.cos(rad(d)) - y * Math.sin(rad(d)), x * Math.sin(rad(d)) + y * Math.cos(rad(d)));
const at = (r, d) => p(C.x + r * Math.cos(rad(d)), C.y + r * Math.sin(rad(d)));
const circle = (x, y, r, label = 'circle') => ({ type: 'circle', x, y, r, label });
const poly = (points, label = 'polyline') => ({ type: 'poly', points, label });
const regular = (n, r, d = -90, label = 'polygon') => poly(Array.from({ length: n }, (_, i) => at(r, d + i * 360 / n)), label);
const star = (n, outer, inner, d = -90, label = 'star') => poly(Array.from({ length: n * 2 }, (_, i) => at(i % 2 ? inner : outer, d + i * 180 / n)), label);
const diamond = (r, d, long = 13, wide = 6, label = 'diamond') => {
  const a = at(r, d);
  const pts = [[0,-long],[wide,0],[0,long],[-wide,0]].map(([x,y]) => { const q = rot(x,y,d); return p(a.x + q.x, a.y + q.y); });
  return poly(pts, label);
};
const triangle = (r, d, size = 5, label = 'triangle') => {
  const a = at(r, d);
  return poly([[0,-size],[size,size],[-size,size]].map(([x,y]) => { const q = rot(x,y,d); return p(a.x + q.x, a.y + q.y); }), label);
};
const reg = () => [0, 90, 180, 270].map(d => { const q = at(REG_R, d); return circle(q.x, q.y, 2, 'registration hole'); });
const phase = (id, name, visual_role, shapes, notes = '') => ({ id, name, visual_role, shapes, notes });
const frame = () => circle(C.x, C.y, FRAME_R, 'outer perimeter — cut last');
const gline = (cmd, x, y, extra = '') => `${cmd} X${f(x)} Y${f(y)}${extra ? ` ${extra}` : ''}`;
function gcodeShape(s) {
  const out = [`(${s.label})`];
  if (s.type === 'circle') {
    out.push(gline('G0', s.x + s.r, s.y));
    out.push(`M4 S${PROFILE.power_s}`);
    out.push(`G2 X${f(s.x - s.r)} Y${f(s.y)} I${f(-s.r)} J0 F${PROFILE.feed_mm_min}`);
    out.push(`G2 X${f(s.x + s.r)} Y${f(s.y)} I${f(s.r)} J0`);
  } else {
    const [first, ...rest] = s.points;
    out.push(gline('G0', first.x, first.y));
    out.push(`M4 S${PROFILE.power_s}`);
    for (const point of [...rest, first]) out.push(gline('G1', point.x, point.y, `F${PROFILE.feed_mm_min}`));
  }
  out.push('M5');
  return out;
}
function svgShape(s) {
  if (s.type === 'circle') return `<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r)}"/>`;
  return `<path d="M ${s.points.map(q => `${f(q.x)} ${f(q.y)}`).join(' L ')} Z"/>`;
}
function makeProgram(example) {
  const lines = [
    `(RITUAL GEOMETRY — ${example.title.toUpperCase()})`,
    '(STATE: DRAFT. NOT A CALIBRATED OR RELEASED MACHINE FILE.)',
    `(PROFILE: ${PROFILE.controller}; F${PROFILE.feed_mm_min}; S${PROFILE.power_s} IS ILLUSTRATIVE ONLY.)`,
    `(JIG: ${PROFILE.coordinate_system})`,
    '(SAFETY: VERIFY LASER MODE, AIR, FOCUS, ORIGIN, BOUNDARY AND MATERIAL BEFORE RESUME.)',
    '(EACH M0 PAUSE REQUIRES THE NAMED LAYER TO BE LOADED AGAINST THE SAME FOUR PINS.)',
    'G21', 'G90', 'G17', 'G94', 'M5', 'M4 S0'
  ];
  example.passes.forEach((pass, index) => {
    lines.push('', `(PASS ${String(index + 1).padStart(2, '0')} — ${pass.id} — ${pass.name})`);
    lines.push(`(ROLE: ${pass.visual_role})`);
    lines.push(`M0 (LOAD ${pass.id}; ALIGN ON 4 PINS; INSPECT BEFORE RESUME)`);
    lines.push('(OPERATION ORDER: registration holes → distinct interior geometry → shared outer perimeter last)');
    [...reg(), ...pass.shapes, frame()].forEach(s => lines.push(...gcodeShape(s)));
  });
  lines.push('', 'M5', 'G0 X0 Y0', 'M2', '(END — REMOVE ONLY AFTER LASER IS OFF)');
  return lines.join('\n') + '\n';
}
function makeSvg(example) {
  const assembled = example.passes.map((pass, i) => `<g class="layer l${i}" stroke="${palette[i % palette.length]}">${[...reg(), ...pass.shapes, frame()].map(svgShape).join('')}</g>`).join('');
  const exploded = example.passes.map((pass, i) => {
    const tx = 462 + (i - (example.passes.length - 1) / 2) * 14;
    const ty = 154 - i * 13;
    return `<g class="layer l${i}" transform="translate(${tx},${ty}) scale(.72) translate(${-C.x},${-C.y})" stroke="${palette[i % palette.length]}">${[...reg(), ...pass.shapes, frame()].map(svgShape).join('')}</g>`;
  }).join('');
  const legend = example.passes.map((pass, i) => `<g transform="translate(${30 + i * 116},292)"><rect width="10" height="10" fill="${palette[i % palette.length]}"/><text x="15" y="9">${pass.id}</text></g>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" role="img" aria-labelledby="title desc">
  <title id="title">${example.title} — assembled and exploded toolpath preview</title>
  <desc id="desc">A preview generated from the same ordered shapes as the corresponding GCode. Left: all layers registered. Right: distinct layers offset to show depth. Colors distinguish passes only.</desc>
  <style>svg{background:#f8f3e9}.field{fill:#fffdf8;stroke:#d7d0c5}.layer{fill:none;stroke-width:1.15;stroke-linejoin:round}.l0{stroke-width:1.8}text{font-family:Arial,sans-serif;font-size:9px;fill:#3b3936;letter-spacing:.06em}.h{font-size:12px;font-weight:700;letter-spacing:.12em}.sub{font-size:8px;fill:#68655f}</style>
  <rect class="field" x="18" y="34" width="250" height="238"/><rect class="field" x="302" y="34" width="320" height="238"/>
  <text class="h" x="18" y="18">${example.title.toUpperCase()}</text><text class="sub" x="18" y="29">PREVIEW DERIVED FROM THE SAME ORDERED SHAPES AS GCODE · DRAFT</text>
  <text x="18" y="48">ASSEMBLED / REGISTERED</text><text x="302" y="48">EXPLODED / LAYER READ</text>
  <g transform="translate(25,55)">${assembled}</g><g>${exploded}</g>${legend}
</svg>`;
}
function quietBloom() {
  return {
    id: 'quiet-bloom-5-layer-stack', title: 'Quiet Bloom — 5-Layer Stack',
    passes: [
      phase('L01_BASE', 'Aperture lattice', 'structural base; twelve open lozenges establish the outer rhythm', Array.from({ length: 12 }, (_, i) => diamond(49, i * 30, 13, 6, 'base lozenge'))),
      phase('L02_CROWN', 'Six-petal crown', 'broad petal field creates depth behind the lattice', Array.from({ length: 6 }, (_, i) => { const q = at(30, i * 60); return circle(q.x, q.y, 17, 'crown petal'); })),
      phase('L03_LATTICE', 'Twelve-point star window', 'single continuous interior cut gives a crisp middle silhouette', [star(12, 54, 34, -90, 'twelve-point lattice window')]),
      phase('L04_VESICA', 'Four vesica windows', 'large diagonal lenses provide a second visual frequency', [45,135,225,315].map(d => { const q = at(27, d); return circle(q.x, q.y, 20, 'vesica window'); })),
      phase('L05_CORE', 'Eight-petal core', 'compact top insert concentrates the finished composition', [...Array.from({ length: 8 }, (_, i) => { const q = at(14, i * 45); return circle(q.x, q.y, 13, 'core petal'); }), circle(C.x, C.y, 5, 'core aperture')])
    ]
  };
}
function frequencyBloom() {
  return {
    id: 'frequency-bloom-7-layer-stack', title: 'Frequency Bloom — 7-Layer Stack',
    physics_note: 'The pass labels preserve the supplied discrete membrane sequence. The cut shapes are a layered visual composition, not a measured vibrating-body experiment.',
    passes: [
      phase('M01_01', 'Rim field', 'visual layer bound to membrane (0,1); no interior node claimed', [circle(C.x, C.y, 56, 'fundamental field ring')]),
      phase('M11_01', 'Single-axis pair', 'visual layer bound to membrane (1,1)', [0,180].map(d => { const q=at(29,d); return circle(q.x,q.y,18,'single-axis lobe'); })),
      phase('M21_01', 'Fourfold lobe ring', 'visual layer bound to membrane (2,1)', [0,90,180,270].map(d => { const q=at(34,d); return circle(q.x,q.y,14,'fourfold lobe'); })),
      phase('M01_02', 'Interior silence ring', 'membrane (0,2) guide ring at 0.435650 × 72 mm = 31.367 mm', [circle(C.x,C.y,31.367,'(0,2) interior guide ring')]),
      phase('M31_01', 'Sixfold spoke crown', 'visual layer bound to membrane (3,1)', Array.from({length:6},(_,i)=>diamond(43,i*60,12,5,'sixfold spoke'))),
      phase('M11_02', 'Axis-plus-halo', 'visual layer bound to membrane (1,2); discrete identity, no interpolated Hz', [circle(C.x,C.y,43,'halo'), ...[0,180].map(d=>{const q=at(18,d);return diamond(18,d,10,5,'axis leaf');})]),
      phase('M01_03', 'Twin silence rings', 'membrane (0,3) guide rings at 0.277896 and 0.637885 × 72 mm', [circle(C.x,C.y,20.009,'(0,3) inner guide ring'),circle(C.x,C.y,45.928,'(0,3) outer guide ring')])
    ]
  };
}
function vogel(n, c = 8, offset = 0) { const alpha = 137.50776405003785; return Array.from({length:n},(_,i)=>{const q=Math.sqrt(i + 1) * c; const d=(i + offset) * alpha; return at(q,d);}); }
function leafSpiral() {
  const modules = (n, kind, offset) => vogel(n, 8, offset).map((q,i) => {
    const d = (i + offset) * 137.50776405003785;
    if(kind==='circle') return circle(q.x,q.y,2.9,'spiral aperture');
    if(kind==='diamond') { const local = [[0,-4.2],[2.5,0],[0,4.2],[-2.5,0]].map(([x,y])=>{const r=rot(x,y,d);return p(q.x+r.x,q.y+r.y)}); return poly(local,'spiral diamond'); }
    return triangle(Math.hypot(q.x-C.x,q.y-C.y), Math.atan2(q.y-C.y,q.x-C.x)*180/Math.PI, 3.8,'spiral triangle');
  });
  return {
    id: 'leaf-spiral-5-layer-stack', title: 'Leaf Spiral — 5-Layer Stack',
    passes: [
      phase('L01_SEED', 'Seven seed apertures', 'sparse circular seed field, lower layer', modules(7,'circle',0)),
      phase('L02_DIAMOND', 'Ten diamond modules', 'rotated diamond modules reveal a second density', modules(10,'diamond',4)),
      phase('L03_TRIANGLE', 'Fourteen triangular leaves', 'triangular leaf field changes silhouette without repeating the base', modules(14,'triangle',9)),
      phase('L04_DENSE', 'Eighteen diamond leaves', 'denser rotated modules provide intermediate depth', modules(18,'diamond',15)),
      phase('L05_POLLEN', 'Twenty-four pollen apertures', 'small top-layer aperture field completes the spiral', modules(24,'circle',22))
    ]
  };
}

const examples = [quietBloom(), frequencyBloom(), leafSpiral()];
const output = [];
for (const example of examples) {
  const gcode = makeProgram(example);
  const svg = makeSvg(example);
  fs.writeFileSync(path.join(here, `${example.id}.gcode`), gcode, 'utf8');
  fs.writeFileSync(path.join(here, `${example.id}-preview.svg`), svg, 'utf8');
  output.push({
    id: example.id, title: example.title, ...PROFILE,
    pass_count: example.passes.length,
    gcode_file: `${example.id}.gcode`, preview_file: `${example.id}-preview.svg`,
    gcode_sha256: createHash('sha256').update(gcode).digest('hex'),
    physics_note: example.physics_note ?? null,
    passes: example.passes.map((x, i) => ({ sequence: i + 1, id: x.id, name: x.name, visual_role: x.visual_role, shape_count: x.shapes.length + 5, notes: x.notes || null }))
  });
}
const validation = {
  package_id: 'RG-GCODE-EXAMPLES-2026-09-14',
  validation_state: 'static_pass; physical_unrun',
  rules: [
    'Each file begins safe with M5, uses G21/G90/G17/G94, ends M5 then M2.',
    'Every pass has M0 and then registration → interior → outer-perimeter ordering.',
    'All commanded XY endpoints lie in 0..200 mm; power/feed are illustrative pending profile binding.',
    'Matching SVG preview is generated from the same ordered shape records as GCode.'
  ],
  examples: output
};
for (const item of output) {
  const text = fs.readFileSync(path.join(here, item.gcode_file), 'utf8');
  const coords = [...text.matchAll(/[XY](-?\d+(?:\.\d+)?)/g)].map(m => Number(m[1]));
  const expectedPauses = item.pass_count;
  const passBlocks = text.split(/\n\(PASS \d{2} — /).slice(1);
  const orderedPasses = passBlocks.length === expectedPauses && passBlocks.every(block => {
    const registration = block.indexOf('(registration hole)');
    const perimeter = block.lastIndexOf('(outer perimeter — cut last)');
    const complete = block.indexOf('\nM5', perimeter);
    return registration >= 0 && perimeter > registration && complete > perimeter;
  });
  if (!text.startsWith(`(RITUAL GEOMETRY`) || !text.includes('\nM5\nM4 S0') || !text.includes('\nM2\n') || (text.match(/^M0 /gm) || []).length !== expectedPauses || !orderedPasses || coords.some(v => v < 0 || v > 200)) throw new Error(`Static validation failed: ${item.id}`);
}
fs.writeFileSync(path.join(here, 'gcode-pass-manifest.json'), JSON.stringify(validation, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({generated: output.map(x => ({id:x.id, passes:x.pass_count, sha256:x.gcode_sha256})), validation: validation.validation_state}, null, 2));
