import { AdapterCoreContext } from './classes';
import { TTask } from './types';

export const execAllTask = async (arr: TTask[], ctx: AdapterCoreContext) => {
  for (const t of arr) {
    await t.startStep(ctx);
  }
};
