import { IncomingHttpHeaders } from 'http';

export const resetCookieKey = (headers: Record<string, string>) => {
  const modifiedCK = 'x-modified-cookie';
  if (headers[modifiedCK]) {
    headers.cookie = headers[modifiedCK];
  }
  return headers;
};

export const modifyCookieKey = (headers: Record<string, string>) => {
  const modifiedCK = 'x-modified-cookie';
  if (headers[modifiedCK]) {
    headers.cookie = headers[modifiedCK];
  }
};

export const incomingToFetchHeaders = (headers: IncomingHttpHeaders) => {
  const result = {} as Record<string, string>;
  for (const [k, v] of Object.entries(headers)) {
    if (Array.isArray(v)) {
      result[k] = v.join(';');
    } else if (typeof v === 'string') {
      result[k] = v;
    } else if (typeof v === 'number') {
      result[k] = String(v);
    }
  }
  return result;
};
