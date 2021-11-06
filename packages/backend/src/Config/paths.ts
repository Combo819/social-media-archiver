import path from 'path';

const staticPath = path.resolve(process.cwd(), './storage', 'static');

const credentialJsonPath = path.resolve(process.cwd(), './', 'credential.json');

const rxdbBasePath = path.resolve(process.cwd(), 'storage', 'rxdb');

const rxdbPath = path.resolve(rxdbBasePath, 'postcrawler');

const logFolderPath = path.resolve(process.cwd(), 'log');
const collectionPath = path.resolve(
  process.cwd(),
  'storage',
  'collection.json',
);

export {
  staticPath,
  credentialJsonPath,
  rxdbBasePath,
  rxdbPath,
  logFolderPath,
  collectionPath,
};
