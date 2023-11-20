import { AdapterCoreContext, TaskStep } from '../classes';
import { CheckEnvStep } from './steps';
import { TCourseItem } from './types';

export class LabCourseTask {
  taskOrder: number = Infinity;

  stepArr: TaskStep[] = [];

  promise: Promise<TCourseItem[]>;

  // @ts-expect-error
  resolve: (v: TCourseItem[]) => void;

  // @ts-expect-error
  reject: (err: unknown) => void;

  constructor() {
    this.stepArr.push(new CheckEnvStep('登陆系统1', '进入实验系统1'));
    this.stepArr.push(new CheckEnvStep('登陆系统2', '进入实验系统2'));
    this.stepArr.push(new CheckEnvStep('登陆系统3', '进入实验系统3'));
    this.stepArr.push(new CheckEnvStep('登陆系统4', '进入实验系统4'));
    this.stepArr.push(new CheckEnvStep('登陆系统5', '进入实验系统5'));
    this.stepArr.push(new CheckEnvStep('登陆系统6', '进入实验系统6'));
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  async startStep(ctx: AdapterCoreContext): Promise<void> {
    for (const s of this.stepArr) {
      if (ctx.taskInfo.abort) {
        throw new Error('外部中断任务');
      }
      await s.runStep(ctx);
    }
    this.resolve([]);
  }
}
