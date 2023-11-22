import { AdapterCoreContext, TaskStep } from '../classes';

const modifiedCK = 'x-modified-cookie';

export class LoginSoaStep extends TaskStep {
  constructor() {
    super('登录soa系统', '使用cas返回的ticket登录soa');
  }

  async startWork(ctx: AdapterCoreContext): Promise<void> {
    if (!ctx.authInfo.casTGC) {
      throw new Error('一站式服务大厅ticket不存在');
    }
    const res = await fetch(
      '/swust/cas/authserver/login?service=https%3A%2F%2Fmatrix' +
        '%2Edean%2Eswust%2Eedu%2Ecn%2FacadmicManager%2Findex' +
        '%2Ecfm%3Fevent%3DstudentPortal%3ADEFAULT%5FEVENT',
      // {
      //   headers: {

      //   }
      // }
    );
    const soaCookie = res.headers.get(modifiedCK);
    if (res.status !== 200 || !soaCookie) {
      throw new Error('soa系统不稳定，请稍后再试');
    }
    ctx.tmpTaskReslut = soaCookie;
  }
}
