/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdapterCoreContext, TaskStep } from '../classes';

export class CheckEnvStep extends TaskStep {
  async runStep(ctx: AdapterCoreContext): Promise<void> {
    setTimeout(this.resolve, 1000);
    return this.promise;
  }
}
