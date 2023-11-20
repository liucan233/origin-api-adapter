/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdapterCoreContext, TaskStep } from '../classes';

export class CheckEnvStep extends TaskStep {
  async startWork(ctx: AdapterCoreContext): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }
}
