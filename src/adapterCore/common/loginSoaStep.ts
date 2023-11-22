import { AdapterCoreContext, TaskStep } from '../classes';

const modifiedCK = 'x-modified-cookie';

export class LoginSoaStep extends TaskStep {
  constructor() {
    super('登录soa系统', '使用cas返回的ticket登录soa');
  }

  async startWork(ctx: AdapterCoreContext): Promise<void> {
    if (!ctx.authInfo.soaTicket) {
      throw new Error('未传入soa ticket');
    }
    const regResult = ctx.authInfo.soaTicket.match(/ticket=.+"/);
    if (!regResult?.length) {
      throw new Error('解析ticket失败');
    }
    const res = await fetch(`/swust/soa/?${regResult[0]}`);
    const soaCookie = res.headers.get(modifiedCK);
    if (res.status !== 200 || !soaCookie) {
      throw new Error('soa系统不稳定，请稍后再试');
    }
    ctx.tmpTaskReslut = soaCookie;
  }
}
