/* eslint-disable max-classes-per-file */
import { AdapterCoreContext, TaskStep } from '../classes';
import { rsaUtils } from './security';

const modifiedCK = 'x-modified-cookie';

interface ITaskData {
  casSession?: string;
  encryptedPasswd?: string;
  passwd?: string;
  account?: string;
}

export class GetCaptchaStep extends TaskStep {
  constructor() {
    super(
      '获取登陆验证码',
      '获取http://cas.swust.edu.cn/authserver/login页面验证码',
    );
  }

  async startWork(ctx: AdapterCoreContext, data: ITaskData): Promise<void> {
    let res = await fetch(
      '/swust/cas/authserver/login?service=http%3A%2F%2Fsoa.swust.edu.cn%2F',
      {
        redirect: 'error',
      },
    );
    const siteSession = res.headers.get(modifiedCK);
    if (!siteSession) {
      throw new Error('获取session失败');
    }
    data.casSession = siteSession;
    res = await fetch('/swust/cas/authserver/captcha', {
      headers: {
        [modifiedCK]: siteSession,
      },
    });
    if (res.headers.has(modifiedCK)) {
      throw new Error('验证码被重写设置cookie');
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
    ctx.tmpTaskReslut = imgBase64;
  }
}

export class LoginCasStep extends TaskStep {
  constructor() {
    super('尝试登陆', '尝试http://cas.swust.edu.cn/authserver/login');
  }

  async startWork(ctx: AdapterCoreContext, data: ITaskData): Promise<void> {
    const imgBase64 = ctx.tmpTaskReslut as string;
    if (!ctx.manual.getCaptchaText) {
      throw new Error('未传入manual.getCaptchaText');
    }
    const captcha = await ctx.manual.getCaptchaText(imgBase64);

    const params = new URLSearchParams();
    params.set('execution', 'e1s1');
    params.set('_eventId', 'submit');
    params.set('geolocation', '');
    params.set('username', data.account as string);
    params.set('lm', 'usernameLogin');
    params.set('password', data.encryptedPasswd as string);
    params.set('captcha', captcha);
    const res = await fetch('/api/cas/login', {
      method: 'post',
      headers: {
        'Upgrade-Insecure-Requests': '1',
        [modifiedCK]: data.casSession as string,
        'Content-Type': 'plain/text',
      },
      body: params.toString(),
    });
    const resText = await res.text();
    if (res.status === 200) {
      ctx.authInfo.soaTicket = resText;
      ctx.tmpTaskReslut = {
        soaTicketUrl: resText,
        casLoginedCookie: res.headers.get(modifiedCK) || 'TGC=error',
      };
      return;
    }
    if (res.status === 401) {
      throw new Error('账号、密码或验证码不正确');
    }

    throw new Error(resText);
  }
}

export class GetUserAccountStep extends TaskStep {
  constructor() {
    super('获取账号密码', '获取需要登陆的账号，原始密码金本地使用');
  }

  async startWork(ctx: AdapterCoreContext, data: ITaskData): Promise<void> {
    if (!ctx.manual.getAccount) {
      throw new Error('未传入manual.getAccount');
    }
    const userAuth = ctx.manual.getAccount();
    if (!userAuth.account) {
      throw new Error('账号为空');
    }
    if (!userAuth.passwd) {
      throw new Error('密码为空');
    }
    data.passwd = userAuth.passwd;
    data.account = userAuth.account;
  }
}

export class GetKeyPairStep extends TaskStep {
  constructor() {
    super('获取RSA公钥', '/authserver/getKey');
  }

  async startWork(ctx: AdapterCoreContext, data: ITaskData): Promise<void> {
    const res = await fetch('/swust/cas/authserver/getKey', {
      headers: {
        [modifiedCK]: data.casSession as string,
      },
    });
    const siteSession = res.headers.get(modifiedCK);
    if (siteSession) {
      throw new Error('session被再次设置');
    }
    const rsaParam: { exponent: string; modulus: string } = await res.json();
    const rsaPublickKey = rsaUtils.getKeyPair(
      rsaParam.exponent,
      '',
      rsaParam.modulus,
    );
    const passwd = data.passwd as string;
    data.encryptedPasswd = rsaUtils.encryptedString(
      rsaPublickKey,
      Array.from(passwd).reverse().join(''),
    );
  }
}
