import dayjs from 'dayjs';
import _ from 'lodash';
const convertToUnix = (obj: any) => {
  const newObj = _.cloneDeep(obj);
  for (const key of Object.keys(newObj)) {
    if (dayjs.isDayjs(newObj[key])) {
      newObj[key] = newObj[key].valueOf();
    }
    if (_.isArray(newObj[key])) {
      for (let i: number = 0; i < newObj[key].length; i++) {
        if (dayjs.isDayjs(newObj[key][i])) {
          newObj[key][i] = newObj[key][i].valueOf();
        }
      }
    }
  }
  return newObj;
};

export { convertToUnix };
