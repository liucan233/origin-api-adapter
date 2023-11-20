import { AdapterCoreContext } from './classes';
import { TTask } from './types';
import { execAllTask } from './executor';
import { LabCourseTask } from './course/classes';

/** sdk对外暴露的入口，先调用addTask，再调用execAllTask开始执行 */
export class AdapterCore {
  taskArr: TTask[] = [];

  context: AdapterCoreContext;

  constructor() {
    this.context = new AdapterCoreContext();
  }

  /** 开始执行以及添加的任务 */
  execAllTask(): Promise<void> {
    if (this.context.taskInfo.running) {
      throw new Error('任务正在执行');
    } else if (this.context.taskInfo.abort) {
      throw new Error('已经终止的任务无法恢复');
    }
    this.taskArr.sort((a, b) => (a <= b ? 1 : -1));
    return execAllTask(this.taskArr, this.context);
  }

  /** 添加任务 */
  addTask<T extends TTask>(task: T, taskOrder?: number): T {
    if (typeof taskOrder === 'number') {
      task.taskOrder = taskOrder;
    }
    this.taskArr.push(task);
    return task;
  }

  /** 终止执行，无法恢复执行 */
  abortAllTask() {
    this.context.taskInfo.abort = true;
  }
}

/** 支持的任务map */
export const supportedTask = {
  getLabCourse() {
    return new LabCourseTask();
  },
};
