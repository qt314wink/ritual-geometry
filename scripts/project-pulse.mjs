import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(await readFile(resolve(root, 'ops/ritual-geometry-work-orders.json'), 'utf8'));
const byPriority = [...plan.work_orders].sort((left, right) => right.priority_score - left.priority_score);
const ready = byPriority.filter(order => order.state === 'ready' || order.state === 'ready_after_visual_direction');
const blocked = byPriority.filter(order => order.state.startsWith('blocked') || order.state.startsWith('awaiting'));
let git = {available:false, dirty_paths:[]};
try {
  git = {available:true, dirty_paths:execFileSync('git', ['status', '--porcelain'], {cwd:root, encoding:'utf8'}).trim().split('\n').filter(Boolean)};
} catch {
  // Pulse output remains useful in an exported folder without Git.
}

const pulse = {
  pulse_version:'rg.project-pulse.v0',
  mode:'read_only; human_review_required',
  thesis:plan.product_thesis,
  top_next:ready.slice(0, 3).map(order => ({id:order.id, title:order.title, score:order.priority_score, intention:order.intention})),
  blocked_or_review_gates:blocked.map(order => ({id:order.id, title:order.title, state:order.state, stop_rules:order.stop_rules})),
  candidate_insights:[
    ...(plan.reconciliation_flags || []).map(flag => ({kind:'architecture_reconciliation', confidence:'high', evidence:flag.observed_mismatch, action:flag.required_decision[0]})),
    ...(git.dirty_paths.length ? [{kind:'reconciliation', confidence:'high', evidence:`${git.dirty_paths.length} uncommitted paths are present.`, action:'Review RG-00 before treating the public remote as current.'}] : []),
    ...(!ready.length ? [{kind:'planning', confidence:'high', evidence:'No work orders are in a ready state.', action:'Review work-order state and prerequisites.'}] : [])
  ],
  guardrail:'This pulse may suggest a next action only. It cannot mutate source, publish, spend, communicate, or change release state.'
};

console.log(JSON.stringify(pulse, null, 2));
