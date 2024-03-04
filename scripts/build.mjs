import { build as _build } from 'esbuild';
import { existsSync, rmSync, readdirSync, statSync, copyFileSync, cpSync, cp } from 'fs';
import { readdir } from 'fs/promises';

// dynamic-required files
const dynamicRequiredDirs = ['views']

// static files
const staticFileDirs = ['public']

// Remove old output
if (existsSync('.zeabur/output')) {
    console.info('Removing old .zeabur/output')
    rmSync('.zeabur/output', {recursive: true})
}

function getModuleEntries() {
    function getModuleEntriesRecursive(dir) {
        let entries = []
        readdirSync(dir).forEach(file => {
            const path = `${dir}/${file}`
            if (statSync(path).isDirectory()) {
                if(file === 'node_modules') return
                entries = entries.concat(getModuleEntriesRecursive(path))
            } else if (file.endsWith('.js')) {
                entries.push(path)
                console.log('added', path);
            }
        })
        return entries
    }
    return getModuleEntriesRecursive('.')
}

async function listFiles(path){
    try {
        const files = await readdir(path, {withFileTypes: true, recursive: true});
        for (const file of files){
          if (file.path.indexOf('node_modules') !== -1) {
            continue;
          }
          console.log(file);
        }
      } catch (err) {
        console.error(err);
      }
}

// build with esbuild
try {
    _build({
        entryPoints: getModuleEntries(),
        bundle: false,
        minify: false,
        outdir: '.zeabur/output/functions/index.func',
        platform: 'node',
        target: 'node20',
        plugins: [{
            name: 'make-all-packages-external',
            setup(build) {
                let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
                build.onResolve({filter}, args => ({path: args.path, external: true}))
            },
        }],
    }).then(res => {
        if (res.errors.length > 0) {
            console.error(res.errors)
            process.exit(1)
        }
        console.info('Successfully built app.js into .zeabur/output/functions/index.func')
        copyFileSync('.zeabur/output/functions/index.func/app.js', '.zeabur/output/functions/index.func/index.js')
        rmSync('.zeabur/output/functions/index.func/app.js')
    })
} catch (error) {
    console.error(error)
}

// copy node_modules into function output directory
console.info('Copying node_modules into .zeabur/output/functions/index.func/node_modules')
cpSync('node_modules', '.zeabur/output/functions/index.func/node_modules', {recursive: true, verbatimSymlinks: true})

// copy package.json into function output directory
console.info('Copying package.json into .zeabur/output/functions/index.func')
cpSync('package.json', '.zeabur/output/functions/index.func/package.json')

// copy dynamic-required files into function output directory, so they can be required during runtime
dynamicRequiredDirs.forEach(dir => {
    copyIfDirExists(dir, `.zeabur/output/functions/index.func/${dir}`)
})

// copy static files into function output directory, so they can be served by the web server directly
staticFileDirs.forEach(dir => {
    copyIfDirExists(dir, `.zeabur/output/static`)
})

await listFiles(`.zeabur/output/functions/index.func`);

function copyIfDirExists(src, dest) {
    if (statSync(src).isDirectory()) {
        console.info(`Copying ${src} to ${dest}`)
        cp(src, dest, {recursive: true}, (err) => {
            if (err) throw err;
        });
        return
    }
    console.warn(`${src} is not a directory`)
}
