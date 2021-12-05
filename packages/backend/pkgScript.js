const execa = require('execa');
const cpy = require('cpy');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

async function pkgScript() {
  const ROOT_PATH = '../../';
  try {
    await execa.command('lerna run build');
    await fs.remove(path.resolve(ROOT_PATH, 'dist'));
    await fs.remove(path.resolve('dist'));
    const { stdout } = await execa('npm', ['run', 'pkg'], { shell: true });
    const lines = stdout.split(/[\r\n]+/);
    const addons = [];
    const directories = [];
    let i = 0;
    while (i < lines.length - 1) {
      const [line, next] = lines.slice(i, i + 2).map((s) => s && s.trim());
      i += 1;
      if (
        line &&
        next &&
        line.startsWith('The addon must be distributed') &&
        next.endsWith('.node')
      ) {
        addons.push(next.replace('%1: ', ''));
        // already know the next was match, so skip 2
        i += 1;
      }

      if (
        line &&
        next &&
        line.startsWith('The directory must be distributed with executable')
      ) {
        directories.push(next.replace('%1: ', ''));
      }
      if (
        line &&
        next &&
        line.startsWith('The file must be distributed with executable')
      ) {
        addons.push(next.replace('%1: ', ''));
      }
      continue;
    }
    if (addons.length) {
      await cpy(addons, path.join('./dist', 'linux'));
    }
    if (directories.length) {
      for (let i = 0; i < directories.length; i++) {
        const source = directories[i];
        const paths = source.split(path.sep);
        await fs.copy(
          source,
          path.join('./dist/', 'linux', paths[paths.length - 1]),
        );
      }
    }
    const namePrefix = 'backend-';
    try {
      await fs.copy('./dist/linux', './dist/win');
      await fs.copy('./dist/linux', './dist/macos');
      await fs.move(
        path.join('./dist', namePrefix + 'win.exe'),
        path.join('./dist', 'win', namePrefix + 'win.exe'),
      );
      await fs.move(
        path.join('./dist', namePrefix + 'macos'),
        path.join('./dist', 'macos', namePrefix + 'macos'),
      );
      await fs.move(
        path.join('./dist', namePrefix + 'linux'),
        path.join('./dist', 'linux', namePrefix + 'linux'),
      );
      await fs.move(path.join('./dist'), path.join(ROOT_PATH, 'dist'));
      await fs.move(
        path.join('..', 'extension-chrome', 'build'),
        path.join(ROOT_PATH, 'dist', 'extension-chrome'),
      );

      await createArchive(
        path.join(process.cwd(), ROOT_PATH, './dist', 'linux'),
        path.join(process.cwd(), ROOT_PATH, './dist', 'linux.tar.gz'),
        'tar',
        'social-media-archiver',
      );
      await createArchive(
        path.join(process.cwd(), ROOT_PATH, './dist', 'macos'),
        path.join(process.cwd(), ROOT_PATH, './dist', 'macos.tar.gz'),
        'tar',
        'social-media-archiver',
      );
      await createArchive(
        path.join(process.cwd(), ROOT_PATH, './dist', 'win'),
        path.join(process.cwd(), ROOT_PATH, './dist', 'win.zip'),
        'zip',
        'social-media-archiver',
      );
      await createArchive(
        path.join(process.cwd(), ROOT_PATH, './dist', 'extension-chrome'),
        path.join(process.cwd(), ROOT_PATH, './dist', 'extension-chrome.zip'),
        'zip',
        'extension-chrome',
      );
    } catch (err) {
      console.log(err, 'error in copySync');
    }
  } catch (err) {
    console.log(err, 'error');
  }
}

const createArchive = (source, dest, type, fileName) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dest);
    const archive = archiver(type, {
      zlib: { level: 9 }, // Sets the compression level.
      gzip: true,
    });
    archive.on('error', function (err) {
      reject(err);
    });

    output.on('close', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log(
        'archiver has been finalized and the output file descriptor has closed.',
      );
      resolve();
    });

    archive.pipe(output);
    archive.directory(source, fileName);
    archive.finalize();
  });
};

pkgScript();
