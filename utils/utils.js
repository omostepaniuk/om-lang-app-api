const fs = require('fs');

async function getBundles(basePath) {
  const files = await fs.promises.readdir(basePath, { withFileTypes: true });
  const bundleDirs = files
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  const bundlesChunks = bundleDirs.map(bundleDirName => getBundleChunks(`${basePath}${bundleDirName}`));

  return Promise.all(bundlesChunks)
    .then(perBundleChunks => {
      return bundleDirs.map((name, index) => {
        const chunks = perBundleChunks[index];
        return {
          name,
          order: index,
          slug: toSlug(name),
          chunks
        }
      });
    });

}

async function getBundleChunks(bundlePath) {
  const files = await fs.promises.readdir(bundlePath, { withFileTypes: true });
  const bundleFiles = files
    .filter(dirent => dirent.isFile())
    .map(dirent => Object.assign({ fileDirent: dirent }, mapToChunkEntry(dirent, ['_', '-'])))
    .sort((a, b) => a.order - b.order);
  const bundleChunks = bundleFiles.map(bundleEntry => mapBundleChunks(bundlePath, bundleEntry));

  return Promise.all(bundleChunks);
}

function mapToChunkEntry(fileDirent, delimiters) {
  if (delimiters.length === 0) {
    throw 'The name of a content file does not match expected format';
  }

  const delimiter = delimiters[0];
  const re = new RegExp(`(.+)${delimiter}(\\d+)\\.txt`, 'g');
  const matchGroups = re.exec(fileDirent.name);

  if (!matchGroups) {
    return mapToChunkEntry(fileDirent, delimiters.slice(1));
  }

  return {
    order: parseInt(matchGroups[2], 10),
    name: matchGroups[1]
  }
}

async function mapBundleChunks(basedir, bundleEntry) {
  const content = await fs.promises.readFile(`${basedir}/${bundleEntry.fileDirent.name}`, { encoding: 'utf-8' });
  const rows = content.split('\n').map(contentRow => contentRow.split(';'));

  return {
    order: bundleEntry.order,
    words: rows.map(row => {
      return {
        word: row[0],
        translations: row.splice(1)
          .map(translation => translation.trim())
          .filter(translation => translation.length)
      }
    })
  };
}

function toSlug(name) {
  return name.toLowerCase().trim().replace(/_+/g, '-');
}

exports.getBundles = getBundles;
