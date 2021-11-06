const parseCookie = (str: string) =>
  str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc: { [property: string]: string }, v: string[]) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

const serializeSingleCookie = (name: string, val: string) =>
  `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;

const serializeCookies = (obj: { [property: string]: string }) => {
  return Object.keys(obj)
    .map((key) => serializeSingleCookie(key, obj[key]))
    .join('; ');
};

const modifyCookie = (cookie: string, key: string, value: string) => {
  const parsedCookie = parseCookie(cookie);
  parsedCookie[key] = value;
  return serializeCookies(parsedCookie);
};

export { modifyCookie };
