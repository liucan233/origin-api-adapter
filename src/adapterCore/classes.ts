/** 任务里的步骤，一个任务保包含多个步骤 */
export abstract class TaskStep {
  /** 步骤名称 */
  name: string;

  /** 步骤描述 */
  desc: string;

  constructor(name: string, desc: string) {
    this.name = name;
    this.desc = desc;
  }

  abstract startWork(
    ctx: AdapterCoreContext,
    taskData: Record<string, any>,
  ): Promise<void>;
}

/** 适配器核心上下文 */
export class AdapterCoreContext {
  tmpTaskReslut: any;

  taskInfo: {
    /** 终止任务执行 */
    abort?: boolean;
    running?: boolean;
  };

  authInfo: {
    casTGC?: string;
    soaTicket?: string;
  };

  manual: {
    getCaptchaText?: (base64: string) => Promise<string>;
    getAccount?: () => { account: string; passwd: string };
  };

  constructor() {
    this.taskInfo = {};
    this.authInfo = {};
    this.manual = {};
  }
}

/** 任务接口，所有任务需要实现这个接口，Result为执行这个任务返回的数据 */
export class IRunableTask<Result> {
  result: Result | undefined;

  taskData: Record<string, any> = {};

  taskOrder: number = Infinity;

  stepArr: TaskStep[] = [];

  nextStepIndex: number = 0;

  onSuccess?: (v: Result) => void;

  onError?: (err: unknown, stepIndex: number) => void;

  onProgressOrSkip?: (cur: number, total: number, skipped?: boolean) => void;

  async startStep(ctx: AdapterCoreContext): Promise<void> {
    for (let i = 0; i < this.stepArr.length; i++) {
      if (i < this.nextStepIndex) {
        this.onProgressOrSkip?.(i, this.stepArr.length, true);
        continue;
      }
      const s = this.stepArr[i];
      if (ctx.taskInfo.abort) {
        throw new Error('外部中断任务');
      }
      try {
        await s.startWork(ctx, this.taskData);
      } catch (error) {
        if (typeof this.taskData.nextStepIndex === 'number') {
          this.nextStepIndex = this.taskData.nextStepIndex;
        } else {
          this.nextStepIndex = 0;
        }
        this.onError?.(error, i);
        throw error;
      }
      this.onProgressOrSkip?.(i, this.stepArr.length - 1, false);
    }
    this.nextStepIndex = this.stepArr.length;
    this.result = ctx.tmpTaskReslut as Result;
    if (this.result === undefined) {
      this.onError?.(
        new Error('步骤执行完成，但是result为空'),
        this.stepArr.length,
      );
    } else {
      this.onSuccess?.(this.result);
    }
  }
}
