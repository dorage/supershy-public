import * as esbuild from 'esbuild';

const buildOption = {
  platform: 'node',
  entryPoints: ['src/index.ts'],
  loader: {
    // ensures .node binaries are copied to ./dist
    '.node': 'copy',
  },
  minify: true,
  bundle: true,
  outfile: 'dist/index.mjs',
  format: 'esm',
  logLevel: 'debug',
  banner: {
    js: `
  // BANNER START
  const require = (await import("node:module")).createRequire(import.meta.url);
  const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
  const __dirname = (await import("node:path")).dirname(__filename);
  // BANNER END
  `,
  },
};

async function main() {
  return await esbuild
    .build(buildOption)
    .then((e) => {
      console.log(e);
      console.log(`[Result]: ${buildOption.outfile}`);
    })
    .catch((e) => console.error(e));
}

main();
