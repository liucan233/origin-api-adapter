import { appTools, defineConfig } from '@modern-js/app-tools';
import { bffPlugin } from '@modern-js/plugin-bff';
import { expressPlugin } from '@modern-js/plugin-express';
import cookie from 'cookie';

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
        target: 'http://cas.swust.edu.cn',
        onProxyRes(incoming) {
          const setCookie = incoming.headers['set-cookie'];
          if (setCookie?.length) {
            incoming.headers['set-cookie'] = undefined;
            let resCookie = '';
            for (const c of setCookie) {
              const parsedCookie = cookie.parse(c);
              for (const [k, v] of Object.entries(parsedCookie)) {
                if (k !== 'path' && k !== 'Path') {
                  resCookie += `${k}=${v}`;
                }
              }
            }
            incoming.headers['x-modified-cookie'] = resCookie;
          }
        },
      },
    },
  },
});
