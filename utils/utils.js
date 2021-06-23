const fs = require('fs');

async function parseBundles(path) {
  const files = await fs.promises.readdir(path, { withFileTypes: true });
  const bundleFiles = files
    .filter(dirent => dirent.isFile())
    .map(dirent => Object.assign({ fileDirent: dirent }, mapToBundleEntry(dirent)))
    .sort((a, b) => a.order - b.order);
  const bundleChunks = bundleFiles.map(bundleEntry => mapBundleChunks(path, bundleEntry));

  return Promise.all(bundleChunks)
    .then(chunks => {
      const bundleName = bundleFiles[0].name.replace(/_/g, ' ');

      return [{ name: bundleName, order: 0, chunks }]
    });
}

function mapToBundleEntry(fileDirent) {
  const matchGroups = /(.+)_(\d+)\.txt/g.exec(fileDirent.name);
  if (!matchGroups) {
    throw 'The name of a content file does not match expected format';
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

exports.parseBundles = parseBundles;
