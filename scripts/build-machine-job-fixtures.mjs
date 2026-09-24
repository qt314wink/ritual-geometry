import {copyFile, mkdir, readdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, extname, basename, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = resolve(root, 'examples');
const outputDirectory = resolve(root, 'apps/atlas/public/fixtures/machine-jobs');
const outputManifest = resolve(outputDirectory, 'manifest.json');
const sourceFiles = (await readdir(sourceDirectory))
  .filter(file => file.endsWith('.machine-job.json'))
  .sort();

if (!sourceFiles.length) throw new Error('No canonical MachineJob examples were found.');
await mkdir(outputDirectory, {recursive:true});

const jobs = [];
for (const file of sourceFiles) {
  const sourcePath = resolve(sourceDirectory, file);
  const job = JSON.parse(await readFile(sourcePath, 'utf8'));
  if (job.schema_version !== 'rg.machine-job.v0') throw new Error(`${file}: unexpected MachineJob schema.`);
  if (typeof job.source?.gcode_path !== 'string' || !job.source.gcode_path.endsWith('.gcode')) throw new Error(`${file}: source.gcode_path must name a GCode fixture.`);
  const programId = basename(job.source.gcode_path, extname(job.source.gcode_path));
  const destination = resolve(outputDirectory, file);
  await copyFile(sourcePath, destination);
  jobs.push({
    program_id: programId,
    machine_job_file: file,
    job_id: job.job_id,
    family: job.family,
    release_state: job.release_state,
    evidence_state: job.evidence_state
  });
}

const duplicates = jobs.filter((job, index) => jobs.findIndex(item => item.program_id === job.program_id) !== index);
if (duplicates.length) throw new Error(`More than one MachineJob targets ${duplicates[0].program_id}.`);

await writeFile(outputManifest, `${JSON.stringify({
  schema_version: 'rg.machine-job-fixture-index.v0',
  generated_from: 'examples/*.machine-job.json',
  jobs
}, null, 2)}\n`);

console.log(`machine-job fixtures: ${jobs.length} copied to public proof rail`);
