/** 任务里的步骤，一个任务保包含多个步骤 */
export abstract class TaskStep {
  /** 步骤名称 */
  name: string;

  /** 步骤描述 */
  desc: string;

  /** 步骤promise，成功/失败 */
  promise: Promise<void>;

  /** sdk内部属性，兑现这个步骤 */
  // @ts-expect-error
  resolve: () => void;

  /** sdk内部属性，失败这个步骤 */
  // @ts-expect-error
  reject: (err: unknown) => void;

  constructor(name: string, desc: string) {
    this.name = name;
    this.desc = desc;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  abstract startWork(ctx: AdapterCoreContext): Promise<void>;
}

/** 适配器核心上下文 */
export class AdapterCoreContext {
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

  promise: Promise<Result>;

  // @ts-expect-error
  resolve: (v: Result) => void;

  // @ts-expect-error
  reject: (err: unknown) => void;

  constructor() {
    this.promise = new Promise<Result>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  async startStep(ctx: AdapterCoreContext): Promise<void> {
    for (const s of this.stepArr) {
      if (ctx.taskInfo.abort) {
        throw new Error('外部中断任务');
      }
      try {
        await s.startWork(ctx);
      } catch (error) {
        s.reject(error);
        this.reject(error);
        return;
      }
      s.resolve();
    }
    if (this.result === undefined) {
      this.reject(new Error('步骤执行完成，但是result为空'));
    } else {
      this.resolve(this.result);
    }
  }
}
