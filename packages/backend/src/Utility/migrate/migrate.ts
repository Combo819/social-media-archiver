import _ from 'lodash';
/**
 * migrate old data to the latest version
 * @param oldInfos
 * @param version
 * @param migrationStrategy
 * @returns
 */
function migrate<Info>(
  oldInfos: any[],
  version: number,
  migrationStrategy: { [key: number]: (oldInfo: any) => any },
): Info[] {
  const migrateFunc = _.get(migrationStrategy, `${version + 1}`);
  let newInfos = oldInfos;
  if (_.isFunction(migrateFunc)) {
    newInfos = oldInfos.map(migrateFunc);
    return migrate(newInfos, version + 1, migrationStrategy);
  }
  return newInfos;
}

export { migrate };
