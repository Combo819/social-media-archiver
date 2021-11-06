import fs from 'fs-extra';

const readJson = async (path: string) => {
  if (!fs.existsSync(path)) {
    return {};
  }
  try {
    const json: object = await fs.readJSON(
      path,
    );
    return json;
  } catch (error) {
    return {};
  }
};

const writeJson = async (
  path: string,
  newJsonObj: object,
) => {
  try {
    fs.writeJSON(path, newJsonObj);
    return true;
  } catch (error) {
    return false;
  }
};

export { readJson, writeJson };
