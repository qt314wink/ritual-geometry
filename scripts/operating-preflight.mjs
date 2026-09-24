import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = [
  'README.md',
  'ops/2026-09-20-intelligent-design-plan.md',
  'ops/ritual-geometry-work-orders.json',
  'docs/decision-package.md',
  'docs/source-register.md',
  'docs/omni-loom-integration.md',
  'apps/atlas/public/fixtures/gcode/gcode-pass-manifest.json',
  'packages/machine-job-contract/schema/machine-job.schema.json'
];
const missing = requiredFiles.filter(file => !existsSync(resolve(root, file)));
const nodeMajor = Number(process.versions.node.split('.')[0]);
let git = {available:false, branch:null, head:null, dirty:null};

try {
  git = {
    available:true,
    branch:execFileSync('git', ['branch', '--show-current'], {cwd:root, encoding:'utf8'}).trim() || null,
    head:execFileSync('git', ['rev-parse', 'HEAD'], {cwd:root, encoding:'utf8'}).trim(),
    dirty:execFileSync('git', ['status', '--porcelain'], {cwd:root, encoding:'utf8'}).trim().split('\n').filter(Boolean).length
  };
} catch {
  // A non-Git export can still be read; it simply cannot perform reconciliation.
}

const plan = JSON.parse(await readFile(resolve(root, 'ops/ritual-geometry-work-orders.json'), 'utf8'));
const machineJobSchema = JSON.parse(await readFile(resolve(root, 'packages/machine-job-contract/schema/machine-job.schema.json'), 'utf8'));
const malformedOrders = plan.work_orders.filter(order => !order.id || !order.title || !Number.isFinite(order.priority_score) || !Array.isArray(order.definition_of_done) || !Array.isArray(order.stop_rules));
const readyOrders = plan.work_orders.filter(order => order.state === 'ready' || order.state === 'ready_after_visual_direction').map(order => ({id:order.id, title:order.title, score:order.priority_score, state:order.state}));
const releaseVocabulary = machineJobSchema.properties?.release_state?.enum || [];
const releaseVocabularyMismatch = !releaseVocabulary.includes('advisory');
const report = {
  check:'ritual-geometry-operating-preflight',
  status:missing.length || nodeMajor < 20 || malformedOrders.length ? 'blocked' : 'ready_with_human_gates',
  node:{version:process.version, required:'>=20', pass:nodeMajor >= 20},
  git,
  required_files:{pass:missing.length === 0, missing},
  work_orders:{schema_version:plan.schema_version, total:plan.work_orders.length, malformed:malformedOrders.map(order => order.id || '<missing-id>'), ready:readyOrders},
  reconciliation_flags:[...(releaseVocabularyMismatch ? [{id:'RG-ARCH-01', severity:'blocking_for_release_workflow', observed:`MachineJob schema omits advisory; current values are ${releaseVocabulary.join(' | ')}.`, action:'Record one versioned release-vocabulary compatibility decision before implementing release/promotion workflow.'}] : [])],
  deliberate_deferrals:['No graphics, graph, analytics, payment, social, ad, cloud, or machine-control dependency is installed by this script.'],
  next_human_gate:'Review RG-00 before assuming the local Proof Rail exists on the public remote. RG-01 may begin as a local prototype using the accepted renderer visual language.'
};

console.log(JSON.stringify(report, null, 2));
if (report.status === 'blocked') process.exitCode = 1;
