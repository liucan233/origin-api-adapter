/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdapterCoreContext, TaskStep } from '../classes';

export class CheckEnvStep extends TaskStep {
  async startWork(ctx: AdapterCoreContext): Promise<void> {
    return new Promise(resolve => {
      ctx.tmpTaskReslut = 1;
      setTimeout(resolve, 1000);
    });
  }
}

export class ErrorStep extends TaskStep {
  async startWork(ctx: AdapterCoreContext): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(Math.random() > 0.3 ? reject : resolve, 1000);
    });
  }
}
