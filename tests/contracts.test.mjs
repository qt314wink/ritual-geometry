import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve(process.cwd());
const fixtureRoot = resolve(root, 'apps/atlas/public/fixtures/gcode');
const machineJobFixtureRoot = resolve(root, 'apps/atlas/public/fixtures/machine-jobs');
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const digest = async path => createHash('sha256').update(await readFile(path)).digest('hex');

const familySchema = await readJson(resolve(root, 'packages/family-schema/schema/family.schema.json'));
const machineJobSchema = await readJson(resolve(root, 'packages/machine-job-contract/schema/machine-job.schema.json'));
assert.equal(familySchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.equal(familySchema.properties.schema_version.const, 'rg.family.v0');
assert.equal(machineJobSchema.$schema, 'https://json-schema.org/draft/2020-12/schema');
assert.equal(machineJobSchema.properties.schema_version.const, 'rg.machine-job.v0');

const manifest = await readJson(resolve(fixtureRoot, 'gcode-pass-manifest.json'));
assert.equal(manifest.validation_state, 'static_pass; physical_unrun');
assert.equal(manifest.examples.length, 3, 'three fixture examples are required');
for (const example of manifest.examples) {
  assert.equal(example.release_state, 'draft');
  assert.ok(example.pass_count >= 5);
  assert.equal(await digest(resolve(fixtureRoot, example.gcode_file)), example.gcode_sha256, `${example.id} source hash`);
  const gcode = await readFile(resolve(fixtureRoot, example.gcode_file), 'utf8');
  assert.match(gcode, /\bG21\b/);
  assert.match(gcode, /\bG90\b/);
  assert.match(gcode, /\bM5\b/);
  assert.match(gcode, /\bM2\b/);
  assert.equal((gcode.match(/\(PASS \d{2} — /g) || []).length, example.pass_count, `${example.id} pass comments`);
}

const machineJob = await readJson(resolve(root, 'examples/quiet-bloom.machine-job.json'));
const publicMachineJob = await readJson(resolve(machineJobFixtureRoot, 'quiet-bloom.machine-job.json'));
const machineJobIndex = await readJson(resolve(machineJobFixtureRoot, 'manifest.json'));
assert.equal(machineJob.schema_version, 'rg.machine-job.v0');
assert.equal(machineJob.release_state, 'draft');
assert.equal(machineJob.evidence_state, 'static_pass; physical_unrun');
assert.equal(machineJob.layers.length, 5);
assert.deepEqual(machineJob.coordinate_frame, {units:'mm', mode:'absolute', jig_mm:{width:200, height:200}, origin:'lower-left'});
assert.equal(machineJob.source.gcode_sha256, manifest.examples.find(item => item.id === 'quiet-bloom-5-layer-stack').gcode_sha256);
for (const layer of machineJob.layers) {
  assert.equal(layer.registration_points_mm.length, 4);
  assert.deepEqual(layer.operation_order, ['registration', 'interior', 'outer_perimeter', 'laser_off']);
}
assert.deepEqual(publicMachineJob, machineJob, 'the served MachineJob must match the canonical handoff example');
assert.equal(machineJobIndex.schema_version, 'rg.machine-job-fixture-index.v0');
assert.equal(machineJobIndex.jobs.length, 1);
const proofRecord = machineJobIndex.jobs.find(item => item.program_id === 'quiet-bloom-5-layer-stack');
assert.ok(proofRecord, 'Quiet Bloom needs a served proof-rail record');
assert.equal(proofRecord.machine_job_file, 'quiet-bloom.machine-job.json');
assert.deepEqual(proofRecord.family, machineJob.family);
assert.equal(proofRecord.release_state, machineJob.release_state);
assert.equal(proofRecord.evidence_state, machineJob.evidence_state);
const quietBloom = manifest.examples.find(item => item.id === proofRecord.program_id);
assert.equal(quietBloom.pass_count, machineJob.layers.length);
assert.deepEqual(machineJob.layers.map(layer => layer.layer_id), quietBloom.passes.map(pass => pass.id));

const atlas = await readFile(resolve(root, 'apps/atlas/public/index.html'), 'utf8');
const renderer = await readFile(resolve(root, 'apps/atlas/public/gcode-renderer.html'), 'utf8');
assert.match(atlas, /href="gcode-renderer\.html"/);
assert.match(atlas, /src="assets\/ritual-geometry-three-systems-concept-v2\.png"/);
assert.match(renderer, /const FIXTURE_ROOT = 'fixtures\/gcode\/';/);
assert.match(renderer, /fetch\(FIXTURE_ROOT \+ example\.gcode_file/);
assert.match(renderer, /download\.href = FIXTURE_ROOT \+ example\.gcode_file/);
assert.match(renderer, /machine-jobs\/manifest\.json/);
assert.match(renderer, /validateMachineJob/);
assert.match(renderer, /static structural proof only/i);

console.log('contracts: pass');
