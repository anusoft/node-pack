export enum PackagingTechnique {
  BUN_SINGLE_BINARY = 'BunSingleBinary',
  VERCEL_NCC = 'VercelNcc',
  VERCEL_PKG = 'VercelPkg',
  ESBUILD = 'Esbuild',
  DOCKER_STANDARD = 'DockerStandard',
  DOCKER_DISTROLESS = 'DockerDistroless',
  DOCKER_MULTISTAGE = 'DockerMultistage',
}

export interface CompatibilityScore {
  nodeVersionSupport: string[]; // e.g., ['18', '20']
  platformSupport: ('linux' | 'macos' | 'windows')[];
  libraryCompatibility: 'good' | 'medium' | 'poor'; // Simplified score
}

export interface BenchmarkResult {
  technique: PackagingTechnique | string; // Allow string for custom/experimental
  appName: 'api' | 'web' | 'fullstack'; // To distinguish between backend/frontend benchmarks

  // File Size Metrics
  bundleSizeMb?: number;          // For NCC, esbuild (uncompressed main bundle)
  executableSizeMb?: number;    // For Bun, pkg
  dockerImageSizeMb?: number;     // For Docker techniques
  compressedBundleSizeMb?: number; // Optional: for compressed bundles

  // Performance Metrics
  coldStartTimeMs?: number;
  warmStartTimeMs?: number;       // May be harder to measure consistently
  memoryUsagePeakMb?: number;
  memoryUsageAvgMb?: number;      // May be harder to measure consistently
  cpuUsagePercent?: number;       // During startup or specific load

  // Compatibility Metrics (Simplified for now)
  compatibility?: CompatibilityScore;

  // Other metadata
  timestamp: string;
  error?: string; // If benchmark failed for this technique
}
