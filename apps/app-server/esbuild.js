import * as esbuild from 'esbuild';
import path from 'node:path';

const productionResolvePlugins = {
  name: 'replaceDev',
  setup(build) {
    // Redirect all paths starting with "images/" to "./public/images/"
    build.onResolve({ filter: /.*\.dev/ }, (args) => {
      return { path: path.join(process.cwd(), 'src', 'helpers', 'mock.ts') };
    });
  },
};

const buildOption = {
  platform: 'node',
  entryPoints: ['node/index.ts'],
  loader: {
    // ensures .node binaries are copied to ./dist
    '.node': 'copy',
  },
  bundle: true,
};

const devBuildOption = {
  ...buildOption,
  outfile: 'dist/index.cjs',
};

const prdBuildOption = {
  ...buildOption,
  outfile: 'dist/index.cjs',
  plugins: [productionResolvePlugins],
  minify: true,
};

function getBuildOption() {
  if (process.argv.includes('--dev') || process.argv.includes('-d')) {
    return devBuildOption;
  }
  if (process.argv.includes('--production') || process.argv.includes('-p')) {
    return prdBuildOption;
  }
  return devBuildOption;
}

async function main() {
  const buildOption = getBuildOption();

  if (process.argv.includes('--watch') || process.argv.includes('-w')) {
    const ctx = await esbuild.context(buildOption);
    await ctx.watch();
    return;
  }

  return await esbuild
    .build(buildOption)
    .then((e) => {
      console.log(e);
      console.log(`[Result]: ${buildOption.outfile}`);
    })
    .catch((e) => console.error(e));
}

main();
