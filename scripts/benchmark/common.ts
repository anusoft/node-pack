// scripts/benchmark/common.ts
import { execSync, ExecSyncOptions } from 'child_process';
import * as path from 'path';
import { PackagingBenchmark, BenchmarkResult, PackagingTechnique } from '../../packages/benchmark/src'; // Adjust path as needed

export const projectRoot = path.resolve(__dirname, '../../'); // Resolve to project root

export function executeCommand(command: string, cwd: string = projectRoot, options?: ExecSyncOptions) {
  console.log(`Executing: ${command} in ${cwd}`);
  try {
    execSync(command, { stdio: 'inherit', cwd, ...options });
    console.log(`Successfully executed: ${command}`);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    return false;
  }
}

export async function runAndRecordBenchmark(
  benchmarkInstance: PackagingBenchmark,
  technique: PackagingTechnique | string,
  appName: 'api' | 'web',
  packageCommand?: string, // e.g., "bun run package:bun"
  appPath?: string // e.g., path.join(projectRoot, 'apps/api')
): Promise<BenchmarkResult | null> {
  console.log(`
--- Starting benchmark for ${technique} on ${appName} ---`);

  if (packageCommand && appPath) {
    console.log(`Running packaging command for ${technique}...`);
    if (!executeCommand(packageCommand, appPath)) {
      console.error(`Packaging failed for ${technique} on ${appName}. Skipping benchmark.`);
      // Record a failed benchmark result
      const failedResult: BenchmarkResult = {
         technique,
         appName,
         error: 'Packaging command failed',
         timestamp: new Date().toISOString(),
      };
      // Access results array directly or add a method to PackagingBenchmark to add a pre-failed result
      // For now, let's assume benchmarkInstance.run will be called and handle its own error state if packaging fails internally,
      // or this failedResult is manually pushed if benchmarkInstance.run is skipped.
      // This example will push it directly for clarity of intent.
      (benchmarkInstance as any).results.push(failedResult); // Casting to any to access private 'results' if needed, or make a public method.
      return failedResult;
    }
  } else {
    console.log(`No packaging command provided for ${technique}, assuming package is ready or technique handles it.`);
  }

  // Pass appPath or other necessary options to benchmarkInstance.run
  // The 'options' for benchmarkInstance.run might need to include appPath or specific paths for executables/images.
  // For Docker, appPath might be projectRoot for build, and imageName for run.
  // Let's assume benchmarkInstance.run can take a generic options object.
  const runOptions: any = { appPath };
  if (technique.toString().startsWith('Docker')) { // Crude check for Docker techniques
      runOptions.imageName = `${appName.toLowerCase()}:${technique.toString().replace('Docker','').toLowerCase()}`; // e.g. api:standard
      if (technique === PackagingTechnique.DOCKER_STANDARD) runOptions.imageName = `${appName.toLowerCase()}:standard`;
      if (technique === PackagingTechnique.DOCKER_DISTROLESS) runOptions.imageName = `${appName.toLowerCase()}:distroless`;
      if (technique === PackagingTechnique.DOCKER_MULTISTAGE) runOptions.imageName = `${appName.toLowerCase()}:multistage`;
  }


  const result = await benchmarkInstance.run(technique, runOptions);
  console.log(`--- Completed benchmark for ${technique} on ${appName} ---`);
  return result;
}

export function getAppPaths() {
  return {
    api: path.join(projectRoot, 'apps/api'),
    web: path.join(projectRoot, 'apps/web'),
  };
}
