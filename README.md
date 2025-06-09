# Node.js Packaging Techniques Comparison

A comprehensive demo project comparing various Node.js packaging and bundling techniques using NestJS backend and Next.js frontend with shadcn/ui components.

## 🎯 Project Goals

- Compare different Node.js packaging techniques for production deployment
- Benchmark file sizes, startup times, and memory usage
- Evaluate Docker image sizes across different packaging methods
- Assess compatibility and upgrade paths for each technique
- Provide actionable insights for production deployment strategies

## 🏗️ Architecture

```
├── apps/
│   ├── api/                 # NestJS backend
│   └── web/                 # Next.js + shadcn/ui frontend
├── packages/
│   ├── shared/              # Shared utilities and types
│   └── benchmark/           # Benchmarking utilities
├── docker/                  # Docker configurations for each technique
├── scripts/                 # Build and packaging scripts
└── results/                 # Benchmark results and analysis
```

## 🛠️ Tech Stack

### Backend (NestJS)
- **Framework**: NestJS with Express
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation

### Packaging Techniques

| Technique | Description | Use Case |
|-----------|-------------|----------|
| **Bun Single Binary** | Compile to standalone executable | Edge deployment, serverless |
| **Vercel ncc + SWC** | Bundle with zero-config | Vercel, lightweight containers |
| **Vercel pkg** | Create executable binaries | Cross-platform distribution |
| **esbuild** | Fast JavaScript bundler | Development, CI/CD |
| **Webpack Bundle** | Traditional bundling | Legacy compatibility |
| **Native Docker** | Multi-stage Docker builds | Container orchestration |
| **Distroless Images** | Minimal container images | Security-focused deployment |

## 🚀 Quick Start

### Prerequisites

```bash
# Required tools
node >= 18.0.0
bun >= 1.0.0
docker >= 20.0.0
docker-compose >= 2.0.0
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nodejs-packaging-comparison

# Install dependencies
bun install

# Setup environment
cp .env.example .env
```

### Development Setup

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Run database migrations
cd apps/api && bun run db:migrate

# Start development servers
bun run dev
```

## 📦 Packaging Techniques

### 1. Bun Single Binary

Creates a self-contained executable with embedded assets.

```bash
# Build backend binary
cd apps/api
bun build --compile --outfile=dist/api-bun ./src/main.ts

# Build frontend static files
cd apps/web
bun run build
bun build --compile --outfile=dist/web-server ./server.js
```

**Pros:**
- Single file deployment
- No Node.js runtime required
- Fast startup times

**Cons:**
- Large binary size
- Platform-specific builds
- Limited debugging capabilities

### 2. Vercel ncc + SWC

Zero-configuration bundling with tree-shaking.

```bash
# Install ncc
bun add -D @vercel/ncc

# Build backend
ncc build apps/api/src/main.ts -o dist/api-ncc

# Build frontend with SWC
cd apps/web
bun run build
ncc build server.js -o dist/web-ncc
```

**Pros:**
- Excellent tree-shaking
- Small bundle sizes
- Fast build times with SWC

**Cons:**
- May break dynamic imports
- Limited configuration options

### 3. Vercel pkg

Cross-platform executable creation.

```bash
# Install pkg globally
npm install -g pkg

# Build executables
pkg apps/api/package.json --out-path dist/pkg/
pkg apps/web/package.json --out-path dist/pkg/
```

**Pros:**
- Cross-platform binaries
- Good Node.js compatibility
- Mature ecosystem

**Cons:**
- Larger file sizes
- Slower startup than native builds

### 4. esbuild

Fast JavaScript bundler and minifier.

```bash
# Build with esbuild
cd apps/api
bun run build:esbuild

cd apps/web
bun run build
bun run build:esbuild
```

**Configuration:**
```javascript
// esbuild.config.js
import { build } from 'esbuild';

await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  platform: 'node',
  target: 'node18',
  minify: true,
  sourcemap: true,
  external: ['@nestjs/microservices', '@nestjs/websockets']
});
```

### 5. Docker Configurations

#### Standard Node.js Image
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/main.js"]
```

#### Distroless Image
```dockerfile
FROM gcr.io/distroless/nodejs18-debian11
COPY dist /app/dist
COPY node_modules /app/node_modules
WORKDIR /app
CMD ["dist/main.js"]
```

#### Multi-stage Build
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN bun install && bun run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

## 📊 Benchmarking

### Automated Benchmark Suite

```bash
# Run comprehensive benchmarks
bun run benchmark:all

# Specific technique benchmarks
bun run benchmark:bun
bun run benchmark:ncc
bun run benchmark:pkg
bun run benchmark:docker
```

### Metrics Collected

1. **File Size Metrics**
   - Bundle size (compressed/uncompressed)
   - Docker image size
   - Binary executable size

2. **Performance Metrics**
   - Cold start time
   - Warm start time
   - Memory usage (peak/average)
   - CPU usage during startup

3. **Compatibility Metrics**
   - Node.js version compatibility
   - Platform support (Linux/macOS/Windows)
   - Library compatibility scores

### Benchmark Implementation

```typescript
// packages/benchmark/src/benchmark.ts
import { performance } from 'perf_hooks';
import { execSync } from 'child_process';

export interface BenchmarkResult {
  technique: string;
  fileSize: number;
  startupTime: number;
  memoryUsage: number;
  dockerImageSize?: number;
  compatibility: CompatibilityScore;
}

export class PackagingBenchmark {
  async benchmarkTechnique(technique: string): Promise<BenchmarkResult> {
    const startTime = performance.now();
    
    // Measure startup time
    const startupTime = await this.measureStartupTime(technique);
    
    // Measure file size
    const fileSize = await this.measureFileSize(technique);
    
    // Measure memory usage
    const memoryUsage = await this.measureMemoryUsage(technique);
    
    // Test compatibility
    const compatibility = await this.testCompatibility(technique);
    
    return {
      technique,
      fileSize,
      startupTime,
      memoryUsage,
      compatibility
    };
  }
}
```

## 🔄 Upgrade Strategy

### Version Management

```json
{
  "scripts": {
    "upgrade:deps": "bun update",
    "upgrade:major": "bunx npm-check-updates -u",
    "upgrade:security": "bun audit --fix",
    "test:compatibility": "bun run test:integration"
  }
}
```

### Compatibility Testing

```bash
# Test against multiple Node.js versions
bun run test:node-16
bun run test:node-18
bun run test:node-20

# Test packaging techniques after upgrades
bun run test:packaging-compatibility
```

### CI/CD Integration

```yaml
# .github/workflows/packaging-benchmark.yml
name: Packaging Benchmark

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0' # Weekly

jobs:
  benchmark:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
        packaging: [bun, ncc, pkg, esbuild]
    
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
        
      - name: Run benchmarks
        run: bun run benchmark:${{ matrix.packaging }}
        
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: benchmark-results-${{ matrix.packaging }}-node${{ matrix.node-version }}
          path: results/
```

## 📈 Results Analysis

### Sample Results

| Technique | File Size | Docker Size | Startup Time | Memory (MB) | Compatibility |
|-----------|-----------|-------------|--------------|-------------|---------------|
| Bun Binary | 45MB | N/A | 150ms | 25MB | ⭐⭐⭐ |
| ncc + SWC | 12MB | 85MB | 200ms | 35MB | ⭐⭐⭐⭐⭐ |
| pkg | 55MB | N/A | 300ms | 45MB | ⭐⭐⭐⭐ |
| esbuild | 8MB | 75MB | 180ms | 30MB | ⭐⭐⭐⭐⭐ |
| Standard | 200MB | 120MB | 250ms | 40MB | ⭐⭐⭐⭐⭐ |
| Distroless | 200MB | 95MB | 240ms | 38MB | ⭐⭐⭐⭐ |

### Analysis Dashboard

```bash
# Generate interactive results dashboard
bun run analyze:results

# Compare specific techniques
bun run compare --techniques=bun,ncc,pkg

# Export results
bun run export:csv
bun run export:json
```

## 🧪 Additional Techniques

### Experimental Packaging

1. **Deno Compile**
   ```bash
   deno compile --allow-all apps/api/src/main.ts
   ```

2. **Rome/Biome Bundling**
   ```bash
   biome bundle apps/api/src/main.ts --outfile=dist/main.js
   ```

3. **Rollup with Node.js**
   ```bash
   rollup -c rollup.node.config.js
   ```

4. **SWC Bundling**
   ```bash
   swc-bundle apps/api/src/main.ts -o dist/main.js
   ```

## 🐳 Docker Optimization

### Multi-architecture Builds

```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t app:latest .

# Compare image sizes across architectures
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Layer Optimization

```dockerfile
# Optimized Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM gcr.io/distroless/nodejs18-debian11
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
WORKDIR /app
CMD ["dist/main.js"]
```

## 🔧 Development Commands

```bash
# Development
bun run dev              # Start all services
bun run dev:api          # Start API only
bun run dev:web          # Start web only

# Building
bun run build            # Build all packages
bun run build:api        # Build API
bun run build:web        # Build web

# Packaging
bun run package:all      # Run all packaging techniques
bun run package:bun      # Bun single binary
bun run package:ncc      # Vercel ncc
bun run package:pkg      # Vercel pkg
bun run package:docker   # Docker images

# Testing
bun run test             # Run all tests
bun run test:unit        # Unit tests
bun run test:integration # Integration tests
bun run test:e2e         # End-to-end tests

# Benchmarking
bun run benchmark        # Full benchmark suite
bun run benchmark:size   # File size comparison
bun run benchmark:perf   # Performance comparison
bun run benchmark:compat # Compatibility testing

# Analysis
bun run analyze          # Generate analysis report
bun run report           # Create comprehensive report
```

## 📚 Resources

- [Bun Documentation](https://bun.sh/docs)
- [Vercel ncc](https://github.com/vercel/ncc)
- [Vercel pkg](https://github.com/vercel/pkg)
- [esbuild Documentation](https://esbuild.github.io/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add new packaging technique or improve benchmarks
4. Update documentation
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- NestJS team for the excellent framework
- Vercel team for ncc and pkg tools
- Bun team for the fast runtime and bundler
- shadcn for the beautiful UI components