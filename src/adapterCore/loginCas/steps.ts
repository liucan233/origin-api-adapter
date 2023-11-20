/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdapterCoreContext, TaskStep } from '../classes';

export class GetCaptchaStep extends TaskStep {
  constructor() {
    super(
      '获取登陆验证码',
      '获取http://cas.swust.edu.cn/authserver/login页面验证码',
    );
  }

  async startWork(ctx: AdapterCoreContext): Promise<void> {
    const res = await fetch('/swust/cas/authserver/captcha');
    const siteSession = res.headers.get('x-modified-cookie');
    if (!siteSession) {
      throw new Error('获取session失败');
    }
    const imgBlob = await res.blob();
    const readImg = new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(imgBlob);
    });
    const imgBase64 = await readImg;
    if (!ctx.manual.getCaptchaText) {
      throw new Error('未传入manual.getCaptchaText');
    }
    const captcha = await ctx.manual.getCaptchaText(imgBase64);
  }
}
