import { AdapterCoreContext, TaskStep } from '../classes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modifiedCK = 'x-modified-cookie';

const defaultTestPath =
  '/swust/cas/authserver/login?service=http%3A%2F%2Fsoa.swust.edu.cn%2F';

export class TryHttpsStep extends TaskStep {
  testPath: string;

  constructor(path?: string) {
    super('尝试使用http协议', '学校系统偶尔使用https，判断使用协议');
    this.testPath = defaultTestPath;
    if (path) {
      this.testPath = path;
    }
  }

  async startWork(ctx: AdapterCoreContext): Promise<void> {
    const res = await fetch(this.testPath, {
      redirect: 'manual',
      headers: { 'x-use-https': '1' },
    });
    if (res.status < 300 && res.status > 199) {
      ctx.tmpTaskReslut = true;
    } else {
      ctx.tmpTaskReslut = false;
    }
  }
}
