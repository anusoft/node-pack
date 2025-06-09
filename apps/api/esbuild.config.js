const { build } = require('esbuild');

build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/esbuild/main.js', // Output directory consistent with script
  platform: 'node',
  format: 'cjs', // NestJS typically uses CommonJS
  target: 'node18',
  minify: true,
  sourcemap: true,
  external: [
    '@nestjs/microservices',
    '@nestjs/websockets',
    'pg-native', // Prisma/pg driver can have optional native deps
    // Add other potentially problematic native modules here
  ],
}).catch(() => process.exit(1));
