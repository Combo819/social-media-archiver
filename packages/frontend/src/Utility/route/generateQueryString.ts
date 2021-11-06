import _ from 'lodash';

function generateQueryString(values: any) {
  let validValues: { [key: string]: any } = {};
  Object.keys(values).forEach((key: string) => {
    const value = values[key];
    if (value === undefined || value === null) {
      return false;
    }
    if (value.length !== 0) {
      validValues[key] = value;
    }
  });

  const params = Object.keys(validValues)
    .map(
      (key) =>
        `${key}=${encodeURIComponent(
          _.isObject(validValues[key])
            ? JSON.stringify(validValues[key])
            : validValues[key],
        )}`,
    )
    .join('&');
  return params;
}

export { generateQueryString };
