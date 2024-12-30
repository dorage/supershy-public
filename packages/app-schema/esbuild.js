import * as esbuild from 'esbuild';

// esbuild src/index.ts --minify --bundle --packages=external --platform=node --outfile=dist/index.js --format=esm

const buildOption = {
  platform: 'node',
  entryPoints: ['src/index.ts'],
  minify: true,
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  logLevel: 'debug',
  packages: 'external',
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
