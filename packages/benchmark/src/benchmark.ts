import { performance } from 'perf_hooks';
import { exec, execSync, ExecException } from 'child_process'; // Using exec for async, execSync for sync
import * as fs from 'fs/promises';
import * as path from 'path';
import { filesize } from 'filesize'; // For human-readable sizes, or use a simple function
import { BenchmarkResult, PackagingTechnique, CompatibilityScore } from './types';

// Placeholder for actual paths - these should be configured or passed
const projectRoot = path.resolve(__dirname, '../../../'); // Adjust as needed
const apiAppPath = path.join(projectRoot, 'apps/api');
const webAppPath = path.join(projectRoot, 'apps/web');

export class PackagingBenchmark {
  private results: BenchmarkResult[] = [];

  constructor(private appName: 'api' | 'web') {}

  private async measureFileSize(filePath: string): Promise<number | undefined> {
    try {
      const stats = await fs.stat(filePath);
      return parseFloat((stats.size / (1024 * 1024)).toFixed(2)); // Size in MB
    } catch (error) {
      console.error(`Error measuring file size for ${filePath}:`, error);
      return undefined;
    }
  }

  private async measureDockerImageSize(imageName: string): Promise<number | undefined> {
    try {
      const output = execSync(`docker images ${imageName} --format "{{.Size}}"`).toString().trim();
      // Output might be like "123MB" or "1.23GB"
      if (output) {
        const sizeMatch = output.match(/(\d+(\.\d+)?)(MB|GB|KB)?/);
        if (sizeMatch) {
          let size = parseFloat(sizeMatch[1]);
          const unit = sizeMatch[3];
          if (unit === 'GB') size *= 1024;
          if (unit === 'KB') size /= 1024;
          return parseFloat(size.toFixed(2));
        }
      }
      return undefined;
    } catch (error) {
      console.error(`Error measuring Docker image size for ${imageName}:`, error);
      return undefined;
    }
  }

  // Placeholder for startup time measurement
  // This is complex and technique-specific.
  // For executables/node scripts: run them and measure time to a ready signal (e.g., log output)
  // For Docker: docker run, time to container ready/port listening
  private async measureStartupTime(command: string, readyLog?: string, cwd?: string): Promise<number | undefined> {
    return new Promise((resolve) => {
      const start = performance.now();
      const process = exec(command, { cwd }, (error, stdout, stderr) => {
        // This callback is when process EXITS. Not ideal for startup.
        // We need to listen to stdout/stderr for a "ready" signal.
        if (error && !readyLog) { // If no readyLog, any error is a failure to start quickly
          console.error(`Error during startup for command "${command}": ${error.message}`);
          resolve(undefined);
        }
      });

      let output = '';
      const onData = (data: any) => {
        output += data.toString();
        if (readyLog && output.includes(readyLog)) {
          const end = performance.now();
          process.kill(); // Kill process once ready signal is detected
          resolve(parseFloat((end - start).toFixed(2)));
        }
      };

      process.stdout?.on('data', onData);
      process.stderr?.on('data', onData); // Sometimes ready logs are on stderr

      process.on('exit', (code) => {
        if (readyLog && !output.includes(readyLog)) {
          // Process exited before ready log was found
          console.warn(`Process for "${command}" exited (code ${code}) before readyLog "${readyLog}" was detected.`);
          resolve(undefined);
        } else if (!readyLog && code === 0) {
            // If no ready log, assume exit code 0 means it started and finished (e.g. a quick script)
            const end = performance.now();
            resolve(parseFloat((end - start).toFixed(2)));
        } else if (!readyLog && code !==0) {
            resolve(undefined); // Exited with error, no ready log specified
        }
      });

      // Timeout to prevent hanging indefinitely
      setTimeout(() => {
        if (!process.killed) {
          console.warn(`Startup measurement for "${command}" timed out.`);
          process.kill();
          resolve(undefined);
        }
      }, 30000); // 30s timeout
    });
  }

  // Placeholder for memory usage
  // This is very complex. Might need external tools or OS-specific commands.
  // For Node processes, process.memoryUsage() can be used if the script itself reports it.
  // For executables/Docker, would need to monitor from outside.
  private async measureMemoryUsage(pid?: number): Promise<number | undefined> {
    // This is a very simplified placeholder. Real measurement is hard.
    if (pid && process.platform === 'linux') {
      try {
        // Using ps, very rough. Smaps or other tools are better.
        const output = execSync(`ps -p ${pid} -o rss=`).toString().trim();
        return parseFloat((parseInt(output, 10) / 1024).toFixed(2)); // RSS in MB
      } catch (e) { /* ignore */ }
    }
    return undefined;
  }

  private async testCompatibility(technique: PackagingTechnique | string): Promise<CompatibilityScore> {
    // Placeholder - actual tests would involve running on different OS/Node versions
    return {
      nodeVersionSupport: ['18', '20'], // Example
      platformSupport: ['linux'],    // Example
      libraryCompatibility: 'good',  // Example
    };
  }

  public async run(technique: PackagingTechnique | string, options?: any): Promise<BenchmarkResult> {
    console.log(`
Running benchmark for ${technique} on ${this.appName}...`);
    const baseResult: Partial<BenchmarkResult> = {
      technique,
      appName: this.appName,
      timestamp: new Date().toISOString(),
    };

    try {
      // Specific logic for each technique
      switch (technique) {
        case PackagingTechnique.BUN_SINGLE_BINARY:
          // Assume 'bun build --compile' creates 'dist/api-bun' or 'dist/web-server'
          const bunExecutablePath = path.join(this.appName === 'api' ? apiAppPath : webAppPath, 'dist', this.appName === 'api' ? 'api-bun' : 'web-server');
          baseResult.executableSizeMb = await this.measureFileSize(bunExecutablePath);
          // Startup command: './dist/api-bun' or './dist/web-server'
          // Ready log: e.g., "Listening on port" for API, "Ready on http" for web server
          baseResult.coldStartTimeMs = await this.measureStartupTime(
            bunExecutablePath,
            this.appName === 'api' ? 'Listening on port 3001' : 'Ready on http://localhost:3000', // Adjust ready log based on apps
            path.dirname(bunExecutablePath)
          );
          break;

        // ... other cases for NCC, PKG, ESBUILD, Docker ...
        // These will involve running build scripts, then measuring.

        default:
          console.warn(`Benchmark logic for ${technique} not implemented yet.`);
          baseResult.error = 'Not implemented';
      }

      baseResult.compatibility = await this.testCompatibility(technique);

    } catch (e: any) {
      console.error(`Error benchmarking ${technique}: ${e.message}`);
      baseResult.error = e.message;
    }

    const result = baseResult as BenchmarkResult;
    this.results.push(result);
    console.log(`Result for ${technique}:`, result);
    return result;
  }

  public getResults(): BenchmarkResult[] {
    return this.results;
  }

  public async saveResults(filePath: string = 'benchmark-results.json'): Promise<void> {
    const fullPath = path.resolve(projectRoot, 'results', filePath); // Save in global results dir
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, JSON.stringify(this.results, null, 2));
    console.log(`Benchmark results saved to ${fullPath}`);
  }
}

// Example usage (can be moved to a separate run script or index.ts)
// async function main() {
//   const apiBenchmark = new PackagingBenchmark('api');
//   await apiBenchmark.run(PackagingTechnique.BUN_SINGLE_BINARY);
//   // ... run other techniques
//   await apiBenchmark.saveResults('api-benchmark-results.json');

//   const webBenchmark = new PackagingBenchmark('web');
//   // ... run benchmarks for web app
//   await webBenchmark.saveResults('web-benchmark-results.json');
// }

// if (require.main === module) {
//   main().catch(console.error);
// }
