// scripts/benchmark/run-all-benchmarks.ts
import { PackagingBenchmark, PackagingTechnique } from '../../packages/benchmark/src';
import { runAndRecordBenchmark, getAppPaths, projectRoot, executeCommand } from './common';

async function main() {
  const { api: apiPath, web: webPath } = getAppPaths();

  // Initialize benchmark runners
  const apiBenchmark = new PackagingBenchmark('api');
  const webBenchmark = new PackagingBenchmark('web');

  console.log('Starting all benchmarks...');

  // === API Benchmarks ===
  console.log(`
=== Running API Benchmarks ===`);
  await runAndRecordBenchmark(apiBenchmark, PackagingTechnique.BUN_SINGLE_BINARY, 'api', 'bun run package:bun:full', apiPath);
  await runAndRecordBenchmark(apiBenchmark, PackagingTechnique.VERCEL_NCC, 'api', 'bun run package:ncc', apiPath);
  await runAndRecordBenchmark(apiBenchmark, PackagingTechnique.VERCEL_PKG, 'api', 'bun run package:pkg', apiPath);
  await runAndRecordBenchmark(apiBenchmark, PackagingTechnique.ESBUILD, 'api', 'bun run package:esbuild', apiPath);

  // Docker API Benchmarks
  await runAndRecordBenchmark(apiBenchmark, PackagingTechnique.DOCKER_STANDARD, 'api', `docker build -f docker/api/Dockerfile.standard -t api:standard ${projectRoot}`, projectRoot);
  await runAndRecordBenchmark(apiBenchmark, PackagingTechnique.DOCKER_DISTROLESS, 'api', `docker build -f docker/api/Dockerfile.distroless -t api:distroless ${projectRoot}`, projectRoot);
  await runAndRecordBenchmark(apiBenchmark, PackagingTechnique.DOCKER_MULTISTAGE, 'api', `docker build -f docker/api/Dockerfile.multistage -t api:multistage ${projectRoot}`, projectRoot);

  // === Web Benchmarks ===
  // Note: Docker benchmarks for 'web' app are not defined in this script yet.
  // They would follow a similar pattern, building web Docker images and then running them.
  console.log(`
=== Running Web Benchmarks ===`);
  await runAndRecordBenchmark(webBenchmark, PackagingTechnique.BUN_SINGLE_BINARY, 'web', 'bun run package:bun', webPath);
  await runAndRecordBenchmark(webBenchmark, PackagingTechnique.VERCEL_NCC, 'web', 'bun run package:ncc', webPath);
  await runAndRecordBenchmark(webBenchmark, PackagingTechnique.VERCEL_PKG, 'web', 'bun run package:pkg', webPath);
  await runAndRecordBenchmark(webBenchmark, PackagingTechnique.ESBUILD, 'web', 'bun run package:esbuild', webPath);

  // Save results
  await apiBenchmark.saveResults('api-benchmark-results.json');
  await webBenchmark.saveResults('web-benchmark-results.json');

  console.log(`
All benchmarks completed. Results saved in the ${path.join(projectRoot, 'results')} directory.`);
}

main().catch(console.error);
