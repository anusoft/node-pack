// scripts/benchmark/run-bun-benchmark.ts
import { PackagingBenchmark, PackagingTechnique } from '../../packages/benchmark/src';
import { runAndRecordBenchmark, getAppPaths } from './common';

async function main() {
  const { api: apiPath, web: webPath } = getAppPaths();
  const technique = PackagingTechnique.BUN_SINGLE_BINARY;
  const resultsDir = process.env.RESULTS_DIR || 'results'; // Allow overriding results directory

  console.log(`--- Starting ${technique} Benchmarks ---`);

  const apiBenchmark = new PackagingBenchmark('api');
  await runAndRecordBenchmark(apiBenchmark, technique, 'api', 'bun run package:bun:full', apiPath);
  await apiBenchmark.saveResults(`${resultsDir}/api-${technique.toLowerCase().replace(/ /g, '-')}-benchmark-results.json`);

  const webBenchmark = new PackagingBenchmark('web');
  await runAndRecordBenchmark(webBenchmark, technique, 'web', 'bun run package:bun', webPath);
  await webBenchmark.saveResults(`${resultsDir}/web-${technique.toLowerCase().replace(/ /g, '-')}-benchmark-results.json`);

  console.log(`--- ${technique} Benchmarks Completed ---`);
}

main().catch(console.error);
