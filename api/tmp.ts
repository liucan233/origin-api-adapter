import { useContext } from '@modern-js/runtime/express';
import { fetch } from 'node-fetch-native';
import ck from 'cookie';

export default async () => {
  const res = await fetch('http://cas.swust.edu.cn/authserver/captcha');
  const ctx = useContext();
  res.headers.forEach((v, k) => {
    ctx.res.setHeader(k, v);
  });
  const cookie = res.headers.get('set-cookie');
  console.log(ck.parse(cookie));
  const arrayBuffer = await res.arrayBuffer();
  ctx.res.write(new Uint8Array(arrayBuffer));
  ctx.res.end();
};
