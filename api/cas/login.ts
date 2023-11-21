import { fetch } from 'node-fetch-native';
import ck from 'cookie';
import { useContext } from '@modern-js/runtime/express';
// import { incomingToFetchHeaders, resetCookieKey } from '@api/_utils';

const modifiedCK = 'x-modified-cookie';

export const post = async () => {
  const ctx = useContext();
  const rawCookie = ctx.req.headers[modifiedCK];
  if (!rawCookie || rawCookie.length < 1) {
    ctx.res.status(400);
    return '未携带cookie';
  }
  const bodyText = await new Promise<string>(resolve => {
    let resultText = '';
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', chunk => {
      resultText += chunk;
    });
    ctx.req.once('end', () => {
      resolve(resultText);
    });
  });
  const cookie =
    typeof rawCookie === 'string' ? rawCookie : rawCookie.join(';');
  const res = await fetch(
    'https://cas.swust.edu.cn/authserver/login?service=http%3A%2F%2Fsoa.swust.edu.cn%2F',
    {
      redirect: 'manual',
      method: 'post',
      body: bodyText,
      headers: {
        cookie,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  const resText = await res.text();
  if (resText.includes('textError')) {
    ctx.res.status(401);
    return resText;
  }
  const redirectTarget = res.headers.get('location');
  if (!redirectTarget) {
    ctx.res.status(502);
    return '学校系统不稳定，请重试';
  }
  if (redirectTarget.includes('soa.swust')) {
    const casCookie = res.headers.get('set-cookie');
    let resCookie = '';
    if (casCookie) {
      const parsedCookie = ck.parse(casCookie);
      for (const [k, v] of Object.entries(parsedCookie)) {
        if (k !== 'path' && k !== 'Path') {
          resCookie += `${k}=${v};`;
        }
      }
    }
    const r = await fetch(redirectTarget);
    console.log(r.status, r.headers.get('set-cookie'));
    ctx.res.setHeader(modifiedCK, resCookie);
    return redirectTarget;
  }
  ctx.res.status(502);
  return '学校系统不稳定，未预期的错误，请重试';
};

export const get = async () => {
  const ctx = useContext();
  const rawCookie = ctx.req.headers[modifiedCK];
  if (!rawCookie || rawCookie.length < 1) {
    ctx.res.status(400);
    return '未携带cookie';
  }
  const cookie =
    typeof rawCookie === 'string' ? rawCookie : rawCookie.join(';');
  const res = await fetch(
    'https://cas.swust.edu.cn/authserver/login?service=http%3A%2F%2Fsoa.swust.edu.cn%2F',
    {
      redirect: 'manual',
      headers: {
        cookie,
      },
    },
  );
  const redirectTarget = res.headers.get('location');
  if (redirectTarget?.includes('ticket')) {
    return redirectTarget;
  }
  if (res.status === 401 || res.status === 200) {
    ctx.res.status(401);
    return 'cookie已经过期';
  }
  if (res.status > 499) {
    ctx.res.status(502);
    return '学校服务不稳定，请稍后再试';
  }
  ctx.res.status(500);
  console.log(res.headers);
  return '发生未知错误，请重试';
};
