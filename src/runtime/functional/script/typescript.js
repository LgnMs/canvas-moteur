const { rollup } = require('rollup');

const inputOptions = {
    input:  [
        '/Users/liguang/Desktop/workSpace/MyProject/canvas-moteur/demo/project1/source/index.ts',
        // '/Users/liguang/Desktop/workSpace/MyProject/canvas-moteur/demo/project1/source/component1.ts',
        // '/Users/liguang/Desktop/workSpace/MyProject/canvas-moteur/demo/project1/source/page1Script.ts'
    ],
}
const outputOptionsList = [
    {
        file: '.templatesource/inde.xxx.js',
        format: 'es'
    }
];

async function generateOutputs(bundle) {
    for (const outputOptions of outputOptionsList) {
        const { output } = await bundle.write(outputOptions);

        for (const chunkOrAsset of output) {
            if (chunkOrAsset.type === 'asset') {
                console.log('Asset', chunkOrAsset);
            } else {
                console.log('Chunk', chunkOrAsset.modules);
            }
        }
    }
}

async function build() {
    let bundle;
    let buildFailed = false;
    try {
        // create a bundle
        bundle = await rollup(inputOptions);

        // an array of file names this bundle depends on
        console.log(bundle.watchFiles);

        await generateOutputs(bundle);
    } catch (error) {
        buildFailed = true;
        // do some error reporting
        console.error(error);
    }

    if (bundle) {
        // closes the bundle
        await bundle.close();
    }
    process.exit(buildFailed ? 1 : 0);
}

build();