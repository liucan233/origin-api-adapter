import { appTools, defineConfig } from '@modern-js/app-tools';
import { bffPlugin } from '@modern-js/plugin-bff';
import { expressPlugin } from '@modern-js/plugin-express';
import cookie from 'cookie';

const modifiedCK = 'x-modified-cookie';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  plugins: [appTools(), expressPlugin(), bffPlugin()],
  bff: {
    proxy: {
      '/swust/cas': {
        pathRewrite: {
          '/swust/cas': '',
        },
        proxyTimeout: 2000,
        timeout: 3000,
        target: 'https://cas.swust.edu.cn',
        onProxyRes(incoming) {
          const setCookie = incoming.headers['set-cookie'];
          incoming.headers['cache-control'] = 'no-store';
          if (setCookie?.length) {
            incoming.headers['set-cookie'] = undefined;
            let resCookie = '';
            for (const c of setCookie) {
              const parsedCookie = cookie.parse(c);
              for (const [k, v] of Object.entries(parsedCookie)) {
                if (k !== 'path' && k !== 'Path') {
                  resCookie += `${k}=${v};`;
                }
              }
            }
            incoming.headers[modifiedCK] = resCookie;
          }
        },
        onProxyReq(proxyReq, incoming) {
          const ck = incoming.headers[modifiedCK];
          if (ck) {
            proxyReq.setHeader('Cookie', ck);
          }
        },
      },
      '/swust/soa': {
        pathRewrite: {
          '/swust/soa': '',
        },
        proxyTimeout: 2000,
        timeout: 3000,
        target: 'http://soa.swust.edu.cn',
        onProxyRes(incoming) {
          const setCookie = incoming.headers['set-cookie'];
          incoming.headers['cache-control'] = 'no-store';
          if (setCookie?.length) {
            incoming.headers['set-cookie'] = undefined;
            let resCookie = '';
            for (const c of setCookie) {
              const parsedCookie = cookie.parse(c);
              for (const [k, v] of Object.entries(parsedCookie)) {
                if (k !== 'path' && k !== 'Path') {
                  resCookie += `${k}=${v};`;
                }
              }
            }
            incoming.headers[modifiedCK] = resCookie;
          }
        },
        onProxyReq(proxyReq, incoming) {
          const ck = incoming.headers[modifiedCK];
          if (ck) {
            proxyReq.setHeader('Cookie', ck);
          }
        },
      },
    },
  },
});
