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

  abstract startWork(ctx: AdapterCoreContext): Promise<void>;
}

/** 适配器核心上下文 */
export class AdapterCoreContext {
  tmpTaskReslut: unknown;

  taskInfo: {
    /** 终止任务执行 */
    abort?: boolean;
    running?: boolean;
  };

  userInfo: {
    account?: string;
    passwd?: string;
    encryptedPasswd?: string;
    identity?: '本科生';
  };

  manual: {
    getCaptchaText?: (base64: string) => Promise<string>;
  };

  constructor() {
    this.taskInfo = {};
    this.userInfo = {};
    this.manual = {};
  }
}

/** 任务接口，所有任务需要实现这个接口，Result为执行这个任务返回的数据 */
export class IRunableTask<Result> {
  result: Result | undefined;

  taskOrder: number = Infinity;

  stepArr: TaskStep[] = [];

  lastStepIndex: number = 0;

  onSuccess?: (v: Result) => void;

  onError?: (err: unknown, stepIndex: number) => void;

  onProgress?: (cur: number, total: number) => void;

  async startStep(ctx: AdapterCoreContext): Promise<void> {
    if (this.lastStepIndex >= this.stepArr.length) {
      return;
    }
    for (let i = this.lastStepIndex; i < this.stepArr.length; i++) {
      const s = this.stepArr[i];
      this.lastStepIndex = i;
      if (ctx.taskInfo.abort) {
        throw new Error('外部中断任务');
      }
      try {
        await s.startWork(ctx);
      } catch (error) {
        this.onError?.(error, i);
        throw error;
      }
      this.onProgress?.(i, this.stepArr.length - 1);
    }
    this.lastStepIndex++;
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
