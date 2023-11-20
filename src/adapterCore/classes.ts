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
  reject: () => void;

  constructor(name: string, desc: string) {
    this.name = name;
    this.desc = desc;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  abstract runStep(ctx: AdapterCoreContext): Promise<void>;
}

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

  constructor() {
    this.taskInfo = {};
    this.userInfo = {};
  }
}
