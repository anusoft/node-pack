// scripts/benchmark/run-docker-benchmarks.ts
import { PackagingBenchmark, PackagingTechnique } from '../../packages/benchmark/src';
import { runAndRecordBenchmark, projectRoot } from './common'; // Added projectRoot from common

async function main() {
  const apiBenchmark = new PackagingBenchmark('api');
  const techniques = [
    PackagingTechnique.DOCKER_STANDARD,
    PackagingTechnique.DOCKER_DISTROLESS,
    PackagingTechnique.DOCKER_MULTISTAGE,
  ];
  const resultsDir = process.env.RESULTS_DIR || 'results';

  console.log(`--- Starting Docker API Benchmarks ---`);

  for (const technique of techniques) {
    let dockerBuildCommand = '';
    // imageName will be constructed in common.ts or passed to benchmark.run via options
    // For Docker, appPath for executeCommand (docker build) is projectRoot.
    // The benchmarkInstance.run will handle 'docker run' using the derived imageName.

    switch (technique) {
      case PackagingTechnique.DOCKER_STANDARD:
        dockerBuildCommand = `docker build -f docker/api/Dockerfile.standard -t api:standard ${projectRoot}`;
        break;
      case PackagingTechnique.DOCKER_DISTROLESS:
        dockerBuildCommand = `docker build -f docker/api/Dockerfile.distroless -t api:distroless ${projectRoot}`;
        break;
      case PackagingTechnique.DOCKER_MULTISTAGE:
        dockerBuildCommand = `docker build -f docker/api/Dockerfile.multistage -t api:multistage ${projectRoot}`;
        break;
      default:
        console.warn(`Unknown Docker technique: ${technique}`);
        continue;
    }
    await runAndRecordBenchmark(apiBenchmark, technique, 'api', dockerBuildCommand, projectRoot);
  }
  // Save results with a generic name for all Docker API benchmarks, or could save per technique
  await apiBenchmark.saveResults(`${resultsDir}/api-docker-techniques-benchmark-results.json`);
  console.log(`--- Docker API Benchmarks Completed ---`);
}
main().catch(console.error);
